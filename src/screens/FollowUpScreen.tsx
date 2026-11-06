import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { C } from "../theme/tokens";
import { FlowAction, FlowChoice, FlowScreen, flowText } from "../components/FigmaFlow";
import { urgentCopy } from "../domain/patient";
import type { Answer } from "../domain/patient";
import { getFollowUpDestination, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

const f = StyleSheet.create({
  heading: { ...flowText, fontSize: 29, fontWeight: "700", lineHeight: 38, color: C.text, marginBottom: 20 },
  info: { backgroundColor: C.aiMist, borderRadius: 24, minHeight: 78, paddingHorizontal: 14,
    paddingVertical: 17, flexDirection: "row", alignItems: "center", gap: 12 },
  infoIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: C.violet, alignItems: "center", justifyContent: "center" },
  infoText: { ...flowText, flex: 1, fontSize: 12, fontWeight: "500", lineHeight: 18, color: C.text },
  question: { ...flowText, fontSize: 18, lineHeight: 26, fontWeight: "600", color: C.text, marginBottom: 18 },
  chipRow: { flexDirection: "row", gap: 10 },
  separator: { height: 1, backgroundColor: C.border, marginTop: 28, marginBottom: 28 },
  safety: { backgroundColor: C.ink, borderRadius: 24, marginTop: 32, padding: 18, gap: 10 },
  safetyHeading: { ...flowText, fontSize: 12, fontWeight: "600", lineHeight: 18, color: C.mint },
  safetyCopy: { ...flowText, fontSize: 12, fontWeight: "500", lineHeight: 18, color: C.white },
  safetyChip: { flex: 1, borderRadius: 13, height: 35, justifyContent: "center", alignItems: "center", backgroundColor: C.inkSoft },
  safetyChipText: { ...flowText, fontSize: 12, fontWeight: "600", color: C.white },
});

export function FollowUpScreen({ d, patch, go, back }: ScreenProps) {
  const urgent = isUrgentAnswer(d.severe);
  return <FlowScreen title="Health check" step="Step 2 • Questions" back={back}>
    <Text style={f.heading}>A few things{"\n"}I still need to know.</Text>
    <View style={f.info}>
      <View style={f.infoIcon}><Image source={require("../../assets/figma/followup-pulse.png")}
        resizeMode="contain" style={{ width: 20, height: 20 }} /></View>
      <Text style={f.infoText}>I'm organising your symptoms for a clinician — not diagnosing you.</Text>
    </View>
    <View style={{ marginTop: 28 }}>
      <Text style={f.question}>When did this start?</Text>
      <View style={f.chipRow}>
        {["Today", "Since yesterday", "2+ days"].map(value =>
          <FlowChoice key={value} label={value} selected={d.duration === value}
            onPress={() => patch({ duration: value })} style={{ flex: 1 }} />)}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Not sure when symptoms began"
        onPress={() => patch({ duration: "Not sure" })} style={{ alignSelf: "flex-end", marginTop: 8 }}>
        <Text style={{ ...flowText, fontSize: 11, color: d.duration === "Not sure" ? C.ink : C.muted }}>
          {d.duration === "Not sure" ? "✓ Not sure" : "Not sure"}
        </Text>
      </Pressable>
    </View>
    <View style={f.separator} />
    <Text style={f.question}>Have you been vomiting?</Text>
    <View style={f.chipRow}>
      {(["No", "Yes", "Not sure"] as Answer[]).map(value =>
        <FlowChoice key={value} label={value} selected={d.vomiting === value}
          onPress={() => patch({ vomiting: value })} style={{ flex: 1 }} />)}
    </View>
    <View style={f.safety}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image source={require("../../assets/figma/shield.png")} resizeMode="contain"
          style={{ width: 22, height: 22 }} />
        <Text style={f.safetyHeading}>Safety check</Text>
      </View>
      <Text style={f.safetyCopy}>Are you experiencing a severe or sudden symptom now, such as difficulty breathing, fainting or severe chest pain?</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["No", "Yes", "Not sure"] as Answer[]).map(value =>
          <Pressable key={value} accessibilityRole="button" accessibilityLabel={"Safety: " + value}
            accessibilityState={{ selected: d.severe === value }}
            onPress={() => patch({ severe: value })}
            style={[f.safetyChip, d.severe === value && { backgroundColor: C.mint }]}>
            <Text style={[f.safetyChipText, d.severe === value && { color: C.ink }]}>{value}</Text>
          </Pressable>)}
      </View>
      {urgent && <Text accessibilityRole="alert" style={{ ...flowText, color: C.lime, fontSize: 12, lineHeight: 18 }}>
        {urgentCopy}
      </Text>}
    </View>
    <FlowAction style={{ marginTop: 30 }} label={urgent ? "View urgent guidance" : "Continue"}
      onPress={() => go(getFollowUpDestination(d.severe))} />
  </FlowScreen>;
}
