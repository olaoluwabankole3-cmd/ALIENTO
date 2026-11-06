import { CareConnection, careTestingEnabled } from "../care/CareConnection";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import { Check } from "../components/ui";
import { FlowAction, FlowBadge, FlowScreen, flowText } from "../components/FigmaFlow";
import { isConsentReady } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

const s = StyleSheet.create({
  heading: { ...flowText, color: C.ink, fontSize: 27, lineHeight: 36, fontWeight: "700", marginTop: 15 },
  body: { ...flowText, fontSize: 13, fontWeight: "400", lineHeight: 20, color: C.muted, marginTop: 12, marginBottom: 30 },
  label: { ...flowText, fontSize: 12, fontWeight: "600", lineHeight: 18, color: C.text, marginBottom: 10 },
  input: { ...flowText, fontSize: 13, color: C.text, backgroundColor: C.white, borderRadius: 14, height: 48, paddingHorizontal: 16, marginBottom: 18 },
  card: { backgroundColor: C.white, borderRadius: 20, padding: 16, gap: 12 },
  cardTitle: { ...flowText, color: C.ink, fontSize: 15, fontWeight: "700", lineHeight: 22 },
  note: { ...flowText, color: C.muted, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 10 },
});

export function ConsentScreen({ d, patch, go, back, shell }: ScreenProps) {
  if (careTestingEnabled) return shell("Consent & submission", <CareConnection data={d} />);
  const ready = isConsentReady(d.name, d.phone, d.saveConsent, d.aiAcknowledged) && d.shareConsent;
  return <FlowScreen title="Secure your care" step="Account + permission" back={back}>
    <FlowBadge text="BEFORE CLINICAL REVIEW" color="#0D6960" />
    <Text style={s.heading}>Save your health brief{"\n"}securely.</Text>
    <Text style={s.body}>Create an account and choose what ALIENTO may save and share before a clinician receives your details. Account registration is not active in this demo.</Text>
    <Text style={s.label}>Full name</Text>
    <TextInput accessibilityLabel="Fictional full name" style={s.input}
      value={d.name} onChangeText={name => patch({ name })} placeholder="Enter a test name"
      placeholderTextColor={C.muted} autoCapitalize="words" />
    <Text style={s.label}>Mobile number</Text>
    <TextInput accessibilityLabel="Fictional mobile number" style={s.input}
      value={d.phone} onChangeText={phone => patch({ phone })} placeholder="+234 · Test phone number"
      placeholderTextColor={C.muted} keyboardType="phone-pad" />
    <View style={s.card}>
      <Text style={s.cardTitle}>Your choices</Text>
      <Check checked={d.saveConsent} onPress={() => patch({ saveConsent: !d.saveConsent })}
        label="I agree to save this sample brief for the demo journey." />
      <Check checked={d.shareConsent} onPress={() => patch({ shareConsent: !d.shareConsent })}
        label="I understand a real service would ask permission before sharing with a clinician." />
      <Check checked={d.aiAcknowledged} onPress={() => patch({ aiAcknowledged: !d.aiAcknowledged })}
        label="I understand AI may organise information but does not diagnose or prescribe." />
    </View>
    <Text style={{ ...flowText, color: "#0D6960", fontSize: 11, fontWeight: "600", marginTop: 16 }}>
      Privacy notice and production consent wording are pending review.
    </Text>
    <FlowAction label="Preview review status" color={C.mint}
      style={{ marginTop: 24, minHeight: 56, borderRadius: 18 }}
      disabled={!ready} onPress={() => go("pending")} />
    <Text style={s.note}>No account is verified and no health brief is sent to a clinician in this preview.</Text>
    <Text style={[s.note, { marginTop: 20, color: "#0D6960" }]}>You can seek urgent in-person care without registering.</Text>
  </FlowScreen>;
}
