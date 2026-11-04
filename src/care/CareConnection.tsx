import React, { createContext, useContext, useRef, useState } from "react";
import { Text, TextInput } from "react-native";
import { Btn, Card, Check, Heading, Note } from "../components/ui";
import s from "../theme/styles";
import type { Data } from "../domain/patient";
import { createCareClient } from "./client";
import type { CareCase, Session } from "./client";

// Expo replaces these public build-time values during bundling.
declare const process: { env: {
  EXPO_PUBLIC_ALIENTO_URL?: string;
  EXPO_PUBLIC_ALIENTO_PUBLISHABLE_KEY?: string;
  EXPO_PUBLIC_ALIENTO_PARTNER_ID?: string;
  EXPO_PUBLIC_ALIENTO_CARE_TESTING?: string;
} };
const config = {
  url: process.env.EXPO_PUBLIC_ALIENTO_URL || "",
  key: process.env.EXPO_PUBLIC_ALIENTO_PUBLISHABLE_KEY || "",
  partner: process.env.EXPO_PUBLIC_ALIENTO_PARTNER_ID || "",
};
export const careTestingEnabled = process.env.EXPO_PUBLIC_ALIENTO_CARE_TESTING === "true";
const client = createCareClient(config);
type CareState = {
  busy: boolean;
  setBusy: React.Dispatch<React.SetStateAction<boolean>>;
  lock: React.MutableRefObject<boolean>;
  attempt: React.MutableRefObject<{ key: string; report: object } | null>;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};
const Context = createContext<CareState | null>(null);
export function CareProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const attempt = useRef<{ key: string; report: object } | null>(null);
  return <Context.Provider value={{ session, setSession, attempt, busy, setBusy, lock }}>{children}</Context.Provider>;
}
// An identifier for duplicate suppression only, never an authentication credential.
function submissionKey() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
    const value = Math.floor(Math.random() * 16);
    return (character === "x" ? value : (value & 3) | 8).toString(16);
  });
}
export function CareConnection({ data }: { data?: Data }) {
  const context = useContext(Context)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(Boolean(context.attempt.current));
  const [cases, setCases] = useState<CareCase[]>([]);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const { busy, setBusy, lock, attempt } = context;
  const [retrying, setRetrying] = useState(Boolean(attempt.current));
  async function run(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Please try again."); }
    finally { lock.current = false; setBusy(false); }
  }
  const refresh = async () => { setCases(await client.cases(context.session!)); };
  if (!config.url.startsWith("https://") || !config.key.startsWith("sb_publishable_") || !config.partner)
    return <Note title="Care testing is awaiting setup" body="A dedicated test service must be configured before signing in or sending a fictional brief." />;
  return <>
    <Heading eyebrow="CONNECTED TEST" title={data ? "Send a fictional brief" : "Saved care requests"}
      body="Use an invited test account and fictional information. Your test session lasts until you close the app." />
    {!context.session ? <Card>
      <Text style={s.fieldLabel}>TEST ACCOUNT EMAIL</Text>
      <TextInput accessibilityLabel="Test account email" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" editable={!busy} />
      <Text style={s.fieldLabel}>PASSWORD</Text>
      <TextInput accessibilityLabel="Test account password" value={password} onChangeText={setPassword}
        secureTextEntry autoCapitalize="none" editable={!busy} />
      <Btn title={busy ? "Signing in…" : "Sign in"} disabled={busy || !email.trim() || !password}
        onPress={() => { void run(async () => {
          context.setSession(await client.signIn(email.trim(), password));
          setPassword("");
        }); }} />
    </Card> : <>
      {data && !receipt && <>
        <Note title="Sharing for testing" body="I agree to store this fictional brief with the configured test care team for review. This test does not arrange real medical care." />
        <Check checked={consent} onPress={() => { if (!busy && !retrying) setConsent(!consent); }}
          label="I agree to share this fictional brief for testing." />
        {data.severe !== "No" && <Note title="Urgent guidance" body="Return to the urgent guidance screen. This test workflow cannot handle an urgent concern." />}
        <Btn title={busy ? "Sending…" : retrying ? "Retry the same brief" : "Submit fictional brief"}
          disabled={busy || !consent || !data.symptoms.trim() || data.severe !== "No"}
          onPress={() => { void run(async () => {
            if (!attempt.current) attempt.current = { key: submissionKey(), report: {
              concern: data.symptoms, duration: data.duration, vomiting: data.vomiting, notes: data.notes,
            } };
            setRetrying(true);
            const id = await client.submit(context.session!, attempt.current.key, attempt.current.report);
            setReceipt(id);
            setRetrying(false);
          }); }} />
        {retrying && <Text style={s.hint}>A retry sends the original brief with the same reference. Keep this screen open until the result is confirmed.</Text>}
      </>}
      {receipt && <Note title="Saved successfully" body={"Case reference: " + receipt + ". Open My Care to check for a response."} />}
      <Btn title={busy ? "Please wait…" : "Refresh saved cases"} disabled={busy} onPress={() => { void run(refresh); }} />
      {cases.map(item => <Card key={item.id}>
        <Text style={s.cardTitle}>{item.status === "reviewed" ? "Response available" : "Awaiting review"}</Text>
        <Text selectable style={s.hint}>{item.id}</Text>
        <Text style={s.cardBody}>{item.clinical_outcomes?.response || "No response has been recorded yet."}</Text>
      </Card>)}
      <Btn title="Sign out of this device" variant="outline" disabled={busy} onPress={() => {
        context.setSession(null); setCases([]); setReceipt(""); setConsent(false);
        attempt.current = null; setRetrying(false); setError("");
      }} />
    </>}
    {!!error && <Text accessibilityRole="alert" style={s.cardBody}>{error}</Text>}
  </>;
}
