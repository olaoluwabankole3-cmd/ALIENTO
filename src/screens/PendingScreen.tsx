import { CareConnection, careTestingEnabled } from "../care/CareConnection";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { C } from "../theme/tokens";
import { FlowAction, FlowBadge, FlowScreen, flowText } from "../components/FigmaFlow";
import type { ScreenProps } from "./types";

const p = StyleSheet.create({
  heading: { ...flowText, color: C.ink, fontSize: 29, fontWeight: "700", lineHeight: 38, marginTop: 14 },
  body: { ...flowText, color: C.muted, fontSize: 14, fontWeight: "400", lineHeight: 21, marginTop: 10 },
  card: { backgroundColor: C.ink, borderRadius: 26, minHeight: 218, padding: 20, marginTop: 28 },
  cardTitle: { ...flowText, color: C.white, fontSize: 16, fontWeight: "700", lineHeight: 22 },
  cardBody: { ...flowText, color: "#D3E5E0", fontSize: 12, fontWeight: "400", lineHeight: 17, marginTop: 8 },
  cardDivider: { height: 1, backgroundColor: "#123A3B", marginTop: 23, marginBottom: 20 },
  cardFooter: { ...flowText, color: C.mint, fontSize: 12, fontWeight: "500", lineHeight: 18 },
  section: { ...flowText, color: C.ink, fontSize: 19, fontWeight: "700", lineHeight: 26, marginTop: 28, marginBottom: 18 },
  step: { flexDirection: "row", gap: 14, alignItems: "center", minHeight: 52, marginBottom: 10 },
  stepTitle: { ...flowText, color: C.ink, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  stepBody: { ...flowText, color: C.muted, fontSize: 11, fontWeight: "400", lineHeight: 16, marginTop: 4 },
});

export function PendingScreen({ d, go, back, shell }: ScreenProps) {
  if (careTestingEnabled) return shell("Review status", <CareConnection />);
  const steps = [
    { title: "Review the health brief", body: "Check symptoms and relevant details" },
    { title: "Ask follow-up questions", body: "Clarify anything that needs more context" },
    { title: "Recommend appropriate care", body: "Decisions stay with a qualified clinician" },
  ];
  return <FlowScreen title="Clinical review" step="Your care journey · step 4" back={back}>
    <FlowBadge text="DEMO · NOT SUBMITTED" color="#0D6960" />
    <Text style={p.heading}>Your story is ready{"\n"}for the next step.</Text>
    <Text style={p.body}>In a real service, a qualified professional would review your brief and decide what care is appropriate.</Text>
    <View style={p.card}>
      <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
        <View style={{ width: 74, height: 74, alignItems: "center", justifyContent: "center" }}>
          <Image source={require("../../assets/figma/review-halo-outer.png")} resizeMode="contain"
            style={{ position: "absolute", width: 74, height: 74 }} />
          <Image source={require("../../assets/figma/review-halo-inner.png")} resizeMode="contain"
            style={{ position: "absolute", width: 48, height: 48 }} />
          <Text style={{ color: C.mint, fontSize: 23 }}>◷</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={p.cardTitle}>Sample brief prepared</Text>
          <Text style={p.cardBody}>Your responses are only in this demo session. No clinician has been notified.</Text>
        </View>
      </View>
      <View style={p.cardDivider} />
      <Text style={p.cardFooter}>ALIENTO organises information; clinicians make clinical decisions.</Text>
    </View>
    <Text style={p.section}>What happens next</Text>
    {steps.map((item, i) => <View key={item.title} style={p.step}>
      <View style={{ width: 28, height: 28, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../../assets/figma/review-step.png")} resizeMode="contain"
          style={{ position: "absolute", width: 28, height: 28 }} />
        <Text style={{ ...flowText, color: "#0D6960", fontSize: 11, fontWeight: "700" }}>{i + 1}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={p.stepTitle}>{item.title}</Text>
        <Text style={p.stepBody}>{item.body}</Text>
      </View>
    </View>)}
    <FlowAction color={C.mint} style={{ minHeight: 54, borderRadius: 18, marginTop: 10 }}
      label="View health brief" onPress={() => go("summary")} />
    <Pressable accessibilityRole="button" onPress={() => go("careplan")}
      style={{ marginTop: 20, alignSelf: "center", paddingVertical: 8 }}>
      <Text style={{ ...flowText, fontSize: 12, fontWeight: "600", color: "#0D6960" }}>Explore a sample care-plan scenario</Text>
    </Pressable>
  </FlowScreen>;
}
