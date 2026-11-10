import React, { useCallback, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { C } from "../theme/tokens";
import { createClinicianClient } from "./client";
import type { ClinicianCase, CoordinationCase, EligibleClinician, StaffRole } from "./client";
import type { Session } from "../care/client";

declare const process: { env: {
  EXPO_PUBLIC_ALIENTO_URL?: string;
  EXPO_PUBLIC_ALIENTO_PUBLISHABLE_KEY?: string;
  EXPO_PUBLIC_ALIENTO_STAFF_TESTING?: string;
} };
const connection = {
  url: process.env.EXPO_PUBLIC_ALIENTO_URL || "",
  key: process.env.EXPO_PUBLIC_ALIENTO_PUBLISHABLE_KEY || "",
};
const serviceEnabled =
  process.env.EXPO_PUBLIC_ALIENTO_STAFF_TESTING === "true" &&
  connection.url.startsWith("https://") && connection.key.startsWith("sb_publishable_");
const service = createClinicianClient(connection);
const family = Platform.OS === "web" ? "Manrope" : undefined;
type ViewName = "inbox" | "review" | "coordination";
const sampleCases: ClinicianCase[] = [
  { case_id: "fictional-A1B3", case_status: "pending", created_at: "2026-11-05T09:00:00Z",
    brief: { concern: "Fictional weakness and reduced appetite since yesterday.", duration: "Since yesterday", vomiting: "No" }, reply: null },
  { case_id: "fictional-F091", case_status: "pending", created_at: "2026-11-04T09:00:00Z",
    brief: { concern: "Fictional headache beginning today.", duration: "Today", vomiting: "No" }, reply: null },
  { case_id: "fictional-28AC", case_status: "reviewed", created_at: "2026-11-03T09:00:00Z",
    brief: { concern: "Fictional past concern.", duration: "2+ days", vomiting: "No" },
    reply: "Fictional example response — not medical guidance." },
];
const sampleQueue: CoordinationCase[] = [
  { case_id: "fictional-B641", partner_id: "fictional", created_at: "2026-11-05T09:00:00Z",
    case_status: "pending", assigned_to: null },
  { case_id: "fictional-2F19", partner_id: "fictional", created_at: "2026-11-05T08:00:00Z",
    case_status: "pending", assigned_to: null },
  { case_id: "fictional-3D20", partner_id: "fictional", created_at: "2026-11-04T09:00:00Z",
    case_status: "pending", assigned_to: null },
];
const sampleClinicians: EligibleClinician[] = [
  { partner_id: "fictional", clinician_id: "fictional-C81D" },
  { partner_id: "fictional", clinician_id: "fictional-2D51" },
];

const S = StyleSheet.create({
  viewport: { flex: 1, backgroundColor: C.canvas },
  shell: { flex: 1, flexDirection: "row", backgroundColor: C.canvas, overflow: "hidden" },
  sidebar: { width: 252, backgroundColor: C.ink, padding: 24 },
  brand: { fontFamily: family, fontSize: 27, fontWeight: "700", color: C.mint, lineHeight: 38 },
  brandSub: { fontFamily: family, color: C.white, fontSize: 11, fontWeight: "600", marginTop: 4 },
  nav: { borderRadius: 12, paddingVertical: 17, paddingHorizontal: 14, marginTop: 9 },
  navLabel: { fontFamily: family, color: C.white, fontSize: 14, fontWeight: "600" },
  content: { flex: 1, paddingHorizontal: 36, paddingTop: 38, paddingBottom: 52 },
  title: { fontFamily: family, fontSize: 30, fontWeight: "700", color: C.ink },
  subtitle: { fontFamily: family, fontSize: 13, color: C.muted, marginTop: 12, lineHeight: 20 },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 28 },
  stat: { backgroundColor: C.white, borderRadius: 19, padding: 18, minWidth: 180, flex: 1 },
  kicker: { fontFamily: family, fontSize: 11, fontWeight: "700", color: C.muted },
  number: { fontFamily: family, fontWeight: "700", fontSize: 29, color: C.ink, marginTop: 5 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 20, marginTop: 24 },
  list: { borderRadius: 24, backgroundColor: C.mist, padding: 20, flex: 1, minWidth: 300 },
  panel: { borderRadius: 24, backgroundColor: C.ink, padding: 24, flex: 1, minWidth: 300 },
  whitePanel: { borderRadius: 24, backgroundColor: C.white, padding: 24, flex: 1, minWidth: 300 },
  sectionTitle: { fontFamily: family, fontSize: 20, fontWeight: "700", color: C.ink },
  sectionSub: { fontFamily: family, color: C.muted, fontSize: 12, marginTop: 9, lineHeight: 18 },
  row: { backgroundColor: C.white, borderRadius: 16, padding: 17, marginTop: 12,
    borderWidth: 1, borderColor: "transparent" },
  rowId: { fontFamily: family, color: C.ink, fontWeight: "700", fontSize: 14 },
  rowSub: { fontFamily: family, color: C.muted, fontSize: 12, marginTop: 5 },
  badge: { fontFamily: family, color: C.inkSoft, fontSize: 11, marginTop: 7, fontWeight: "600" },
  panelKicker: { fontFamily: family, color: C.mint, fontWeight: "700", fontSize: 11 },
  panelTitle: { fontFamily: family, color: C.white, fontSize: 23, fontWeight: "700", marginTop: 16 },
  panelText: { fontFamily: family, color: C.white, fontSize: 14, lineHeight: 22, marginTop: 12 },
  label: { fontFamily: family, fontSize: 11, fontWeight: "700", color: C.muted, marginTop: 22 },
  value: { fontFamily: family, color: C.ink, fontSize: 16, lineHeight: 24, marginTop: 8 },
  input: { backgroundColor: C.white, color: C.ink, borderRadius: 16, padding: 16, minHeight: 50,
    fontFamily: family, fontSize: 14, marginTop: 12 },
  button: { backgroundColor: C.mint, borderRadius: 13, minHeight: 47,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: 22, alignSelf: "flex-start" },
  buttonText: { color: C.ink, fontFamily: family, fontSize: 14, fontWeight: "700" },
  error: { color: C.danger, fontFamily: family, fontSize: 13, lineHeight: 20, marginTop: 16 },
  message: { fontFamily: family, color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 15 },
});
const short = (id: string) => id.startsWith("fictional-") ? "CASE · …" + id.split("-")[1] : "CASE · …" + id.slice(-4).toUpperCase();
const nice = (value: unknown) => typeof value === "string" ? value : "Not provided";
function Action({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={({ pressed }) => [S.button, disabled && { opacity: 0.45 }, pressed && { opacity: 0.82 }]}>
    <Text style={S.buttonText}>{title}</Text>
  </Pressable>;
}
function Stat({ label, value, detail }: { label: string; value: number; detail: string }) {
  return <View style={S.stat}><Text style={S.kicker}>{label}</Text>
    <Text style={S.number}>{String(value).padStart(2, "0")}</Text>
    <Text style={S.rowSub}>{detail}</Text></View>;
}
export function ClinicianWorkspace() {
  const { width } = useWindowDimensions();
  const compact = width < 850;
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [cases, setCases] = useState<ClinicianCase[]>([]);
  const [queue, setQueue] = useState<CoordinationCase[]>([]);
  const [clinicians, setClinicians] = useState<EligibleClinician[]>([]);
  const [view, setView] = useState<ViewName>("inbox");
  const [selected, setSelected] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [demo, setDemo] = useState(() => Platform.OS === "web" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("demo") === "1");
  const clinicianRole = demo || roles.some(r => r.staff_role === "clinician");
  const coordinatorRole = demo || roles.some(r => r.staff_role === "coordinator");
  const displayedCases = demo ? sampleCases : cases;
  const displayedQueue = demo ? sampleQueue : queue;
  const displayedStaff = demo ? sampleClinicians : clinicians;
  const currentCase = displayedCases.find(c => c.case_id === selected) ?? displayedCases[0];
  const currentQueue = displayedQueue.find(c => c.case_id === selected) ?? displayedQueue[0];
  const chosenStaff = displayedStaff.find(c => c.clinician_id === selectedStaff) ??
    displayedStaff.find(c => c.partner_id === currentQueue?.partner_id);
  const canWork = Boolean(session && roles.length);
  const reset = () => { setSession(null); setRoles([]); setCases([]); setQueue([]); setClinicians([]);
    setSelected(""); setSelectedStaff(""); setReply(""); setDemo(false); setView("inbox"); setNotice(""); setError(""); };

  const refresh = useCallback(async (signed: Session, memberships: StaffRole[]) => {
    const results = await Promise.all([
      memberships.some(r => r.staff_role === "clinician") ? service.clinicianInbox(signed) : Promise.resolve([]),
      memberships.some(r => r.staff_role === "coordinator") ? service.coordinationQueue(signed) : Promise.resolve([]),
      memberships.some(r => r.staff_role === "coordinator") ? service.clinicians(signed) : Promise.resolve([]),
    ]);
    setCases(results[0]); setQueue(results[1]); setClinicians(results[2]);
  }, []);
  async function run(operation: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try { await operation(); }
    catch (e) { setError(e instanceof Error ? e.message : "Operation unavailable."); }
    finally { setBusy(false); }
  }
  function openPatient() {
    if (Platform.OS === "web" && typeof window !== "undefined") window.location.assign("/");
  }
  const caseList = displayedCases;
  const coordinatorList = displayedQueue;
  const welcome = !demo && !canWork;
  return <View style={S.viewport}>
    <View style={[S.shell, compact && { flexDirection: "column" }]}>
      <View style={[S.sidebar, compact && { width: "100%", padding: 18 }]}>
        <Text style={S.brand}>ALIENTO</Text>
        <Text style={S.brandSub}>CLINICIAN PORTAL · TEST</Text>
        {(!welcome) && <View style={{ marginTop: compact ? 10 : 34 }}>
          {([
            ["inbox", "Assigned inbox", clinicianRole],
            ["review", "Case review", clinicianRole],
            ["coordination", "Care coordination", coordinatorRole],
          ] as [ViewName, string, boolean][]).filter(x => x[2]).map(([page, title]) =>
            <Pressable key={page} accessibilityRole="button" accessibilityState={{ selected: view === page }}
              onPress={() => { setView(page); setError(""); setNotice(""); }} style={[S.nav, view === page && { backgroundColor: C.mint }]}>
              <Text style={[S.navLabel, view === page && { color: C.ink }]}>{title}</Text>
            </Pressable>)}
        </View>}
        <View style={{ flex: compact ? undefined : 1 }} />
        <Text style={{ color: C.mint, fontFamily: family, fontSize: 11, marginTop: 18 }}>RESTRICTED TEST WORKSPACE</Text>
        <Text style={{ color: C.white, fontFamily: family, fontSize: 11, marginTop: 9 }}>
          {demo ? "Fictional preview · no server writes" : session ? "Authenticated · access scoped" : "Staff sign-in required"}
        </Text>
        <Pressable onPress={openPatient} accessibilityRole="link" style={{ marginTop: 20, alignSelf: "flex-start" }}>
          <Text style={{ fontFamily: family, color: C.white, fontSize: 12 }}>Patient app  ↗</Text>
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[S.content, compact && { paddingHorizontal: 20, paddingTop: 24 }]}
        keyboardShouldPersistTaps="handled">
        {welcome ? <>
          <Text style={S.title}>Secure clinical workspace.</Text>
          <Text style={S.subtitle}>Authorised clinicians and coordinators only. This is an ALIENTO fictional-data testing environment.</Text>
          <View style={[S.whitePanel, { marginTop: 30, maxWidth: 560 }]}>
            <Text style={S.sectionTitle}>Sign in with an invited staff account</Text>
            {!serviceEnabled && <Text style={S.message}>
              Connected staff testing is not enabled for this preview. No real cases or staff accounts are accessible here.
            </Text>}
            <TextInput accessibilityLabel="Test staff email" value={email} onChangeText={setEmail}
              autoCapitalize="none" keyboardType="email-address" editable={!busy && serviceEnabled}
              placeholder="Test email" placeholderTextColor={C.muted} style={S.input} />
            <TextInput accessibilityLabel="Test staff password" value={password} onChangeText={setPassword}
              secureTextEntry autoCapitalize="none" editable={!busy && serviceEnabled}
              placeholder="Password" placeholderTextColor={C.muted} style={S.input} />
            <Action title={busy ? "Checking access…" : "Sign in securely"} disabled={busy || !serviceEnabled || !email.trim() || !password}
              onPress={() => { void run(async () => {
                const signed = await service.signIn(email.trim(), password);
                const memberships = await service.roles(signed);
                if (!memberships.length) throw new Error("No active verified staff membership. Ask your administrator.");
                await refresh(signed, memberships);
                setSession(signed); setRoles(memberships); setPassword("");
                setView(memberships.some(r => r.staff_role === "clinician") ? "inbox" : "coordination");
              }); }} />
            <View style={{ borderTopWidth: 1, borderColor: C.border, marginTop: 26, paddingTop: 15 }}>
              <Text style={S.message}>Need to review the design without staff accounts?</Text>
              <Action title="View fictional UI demo" onPress={() => {
                setDemo(true); setView("inbox"); setSelected(""); setReply(""); setError("");
              }} />
            </View>
          </View>
        </> : <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1, minWidth: 260 }}>
              <Text style={S.title}>{view === "inbox" ? "Good morning, clinician." : view === "review" ? "Review case" : "Care coordination"}</Text>
              <Text style={S.subtitle}>{view === "coordination"
                ? "Metadata-only operations · patient symptoms hidden from coordinators"
                : "Only assigned cases and authorised patient reports are visible"}</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={reset}
              style={{ paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12, backgroundColor: C.white }}>
              <Text style={{ color: C.ink, fontWeight: "600", fontFamily: family }}>{demo ? "Exit demo" : "End session"}</Text>
            </Pressable>
          </View>
          {demo && <View style={{ backgroundColor: C.aiMist, padding: 14, borderRadius: 14, marginTop: 20 }}>
            <Text style={{ fontFamily: family, fontSize: 12, color: C.ink }}>
              FICTIONAL UI DEMO — no actual patients, no medical advice, and no database writes. Actions are disabled.
            </Text>
          </View>}
          {view === "inbox" && clinicianRole && <>
            <View style={S.stats}>
              <Stat label="ASSIGNED" value={caseList.length} detail="Your cases only" />
              <Stat label="PENDING" value={caseList.filter(c => c.case_status === "pending").length} detail="Awaiting review" />
              <Stat label="REVIEWED" value={caseList.filter(c => c.case_status === "reviewed").length} detail="Patient response recorded" />
            </View>
            <View style={S.grid}>
              <View style={S.list}>
                <Text style={S.sectionTitle}>Assigned cases</Text>
                <Text style={S.sectionSub}>Only your authorised assigned cases appear here.</Text>
                {caseList.length ? caseList.map(item =>
                  <Pressable key={item.case_id} accessibilityRole="button" onPress={() => setSelected(item.case_id)}
                    style={[S.row, currentCase?.case_id === item.case_id && { borderColor: C.mint }]}>
                    <Text style={S.rowId}>{short(item.case_id)}</Text>
                    <Text style={S.rowSub}>Submitted {new Date(item.created_at).toLocaleDateString()}</Text>
                    <Text style={S.badge}>{item.case_status === "reviewed" ? "REVIEWED" : "AWAITING RESPONSE"}</Text>
                  </Pressable>) : <Text style={S.message}>No cases assigned to this account.</Text>}
              </View>
              <View style={S.panel}>
                <Text style={S.panelKicker}>SELECTED CASE</Text>
                <Text style={S.panelTitle}>{currentCase ? short(currentCase.case_id) : "No case selected"}</Text>
                {currentCase ? <>
                  <Text style={[S.panelKicker, { marginTop: 25 }]}>PATIENT-REPORTED CONCERN</Text>
                  <Text style={S.panelText} numberOfLines={7}>{nice(currentCase.brief.concern)}</Text>
                  <Text style={[S.panelText, { marginTop: 22 }]}>Only the assigned clinician can open this brief.</Text>
                  <Action title="Review case" onPress={() => setView("review")} />
                </> : <Text style={S.panelText}>Wait for an authorised coordinator to assign a case.</Text>}
              </View>
            </View>
          </>}
          {view === "review" && clinicianRole && <View style={S.grid}>
            <View style={S.whitePanel}>
              <Text style={S.kicker}>{currentCase ? short(currentCase.case_id) : "NO ASSIGNED CASE"}</Text>
              <Text style={[S.sectionTitle, { marginTop: 20 }]}>Patient-reported brief</Text>
              {currentCase ? <>
                <Text style={S.label}>CONCERN</Text>
                <Text selectable style={S.value}>{nice(currentCase.brief.concern)}</Text>
                <Text style={S.label}>DURATION</Text><Text style={S.value}>{nice(currentCase.brief.duration)}</Text>
                <Text style={S.label}>VOMITING</Text><Text style={S.value}>{nice(currentCase.brief.vomiting)}</Text>
                {currentCase.brief.notes != null && <><Text style={S.label}>OTHER DETAILS</Text><Text style={S.value}>{nice(currentCase.brief.notes)}</Text></>}
                <Text style={[S.sectionSub, { marginTop: 32 }]}>Only an assigned, verified clinician may read this record.</Text>
              </> : <Text style={S.message}>No case currently assigned.</Text>}
            </View>
            <View style={S.panel}>
              <Text style={S.panelKicker}>PATIENT-FACING RESPONSE</Text>
              <Text style={S.panelTitle}>Care instructions</Text>
              <Text style={S.panelText}>Review the complete brief before responding. Emergency care must not be delayed.</Text>
              {currentCase?.case_status === "reviewed" ? <>
                <Text style={[S.panelKicker, { marginTop: 25 }]}>PREVIOUSLY RECORDED</Text>
                <Text selectable style={S.panelText}>{currentCase.reply || "Response recorded."}</Text>
              </> : <>
                <TextInput multiline accessibilityLabel="Response to patient" value={reply} onChangeText={setReply}
                  editable={!busy && !demo && !!currentCase}
                  placeholder="Enter a clear patient-facing response…" placeholderTextColor={C.muted}
                  style={[S.input, { minHeight: 210, textAlignVertical: "top", marginTop: 23 }]} maxLength={4000} />
                <Text style={S.panelText}>Submitted responses cannot be edited in the current test workflow.</Text>
                <Action title={busy ? "Submitting…" : "Send patient response"}
                  disabled={busy || demo || !currentCase || !reply.trim() || reply.trim().length > 4000}
                  onPress={() => { if (!session || !currentCase) return; void run(async () => {
                    await service.respond(session, currentCase.case_id, reply.trim());
                    await refresh(session, roles); setReply(""); setNotice("Response recorded. The patient can now read it in My Care.");
                  }); }} />
              </>}
            </View>
          </View>}
          {view === "coordination" && coordinatorRole && <>
            <View style={S.stats}>
              <Stat label="UNASSIGNED" value={coordinatorList.filter(c => !c.assigned_to).length} detail="Needs assignment" />
              <Stat label="ASSIGNED" value={coordinatorList.filter(c => !!c.assigned_to).length} detail="Allocated cases" />
              <Stat label="ELIGIBLE CLINICIANS" value={displayedStaff.length} detail="Verified members" />
            </View>
            <View style={S.grid}>
              <View style={S.list}>
                <Text style={S.sectionTitle}>Unassigned cases</Text>
                <Text style={S.sectionSub}>References, status and dates only. No patient details.</Text>
                {coordinatorList.filter(c => !c.assigned_to && c.case_status === "pending").map(item =>
                  <Pressable key={item.case_id} accessibilityRole="button"
                    onPress={() => { setSelected(item.case_id); setSelectedStaff(""); }} style={[S.row,
                    currentQueue?.case_id === item.case_id && { borderColor: C.mint }]}>
                    <Text style={S.rowId}>{short(item.case_id)}</Text>
                    <Text style={S.rowSub}>Received {new Date(item.created_at).toLocaleDateString()}</Text>
                    <Text style={S.badge}>UNASSIGNED</Text>
                  </Pressable>)}
                {coordinatorList.filter(c => !c.assigned_to && c.case_status === "pending").length === 0 &&
                  <Text style={S.message}>No pending cases need assignment.</Text>}
              </View>
              <View style={S.panel}>
                <Text style={S.panelKicker}>ASSIGNMENT</Text>
                <Text style={S.panelTitle}>Select clinician</Text>
                <Text style={S.panelText}>Selected case: {currentQueue ? short(currentQueue.case_id) : "None"}</Text>
                {displayedStaff.filter(c => c.partner_id === currentQueue?.partner_id).map(item =>
                  <Pressable key={item.clinician_id} accessibilityRole="button"
                    accessibilityState={{ selected: chosenStaff?.clinician_id === item.clinician_id }}
                    onPress={() => setSelectedStaff(item.clinician_id)}
                    style={[S.row, chosenStaff?.clinician_id === item.clinician_id && { borderColor: C.mint }]}>
                    <Text style={S.rowId}>Clinician · …{item.clinician_id.slice(-4).toUpperCase()}</Text>
                    <Text style={S.rowSub}>Verified, active partner membership</Text>
                  </Pressable>)}
                <Text style={[S.panelText, { marginTop: 25 }]}>Only authorised coordinators can assign pending cases. Self-assignment is not permitted.</Text>
                <Action title={busy ? "Assigning…" : "Assign selected case"}
                  disabled={busy || demo || !session || !currentQueue || !!currentQueue.assigned_to || !chosenStaff}
                  onPress={() => { if (!session || !currentQueue || !chosenStaff) return; void run(async () => {
                    await service.assign(session, currentQueue.case_id, chosenStaff.clinician_id);
                    await refresh(session, roles); setNotice("Case assigned to the verified clinician.");
                  }); }} />
              </View>
            </View>
          </>}
          {!clinicianRole && view !== "coordination" && <Text style={S.message}>Clinician access is not available for this account.</Text>}
          {!!notice && <Text accessibilityRole="alert" style={S.message}>{notice}</Text>}
          {!demo && !!session && <Action title={busy ? "Refreshing…" : "Refresh workspace"} disabled={busy} onPress={() => {
            void run(async () => { await refresh(session, roles); setNotice("Workspace refreshed."); });
          }} />}
        </>}
        {!!error && <Text accessibilityRole="alert" style={S.error}>{error}</Text>}
      </ScrollView>
    </View>
  </View>;
}
