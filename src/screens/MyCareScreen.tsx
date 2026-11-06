import { CareConnection, careTestingEnabled } from "../care/CareConnection";
import React from "react";
import { Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { C } from "../theme/tokens";
import { FlowAction, FlowBadge, flowText } from "../components/FigmaFlow";
import type { ScreenProps } from "./types";

const c = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  content: { paddingHorizontal: 24, paddingTop: Platform.OS === "web" ? 16 : 20, paddingBottom: 30 },
  status: { height: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusText: { ...flowText, color: C.ink, fontSize: 12, fontWeight: "600" },
  brand: { ...flowText, color: C.ink, fontSize: 20, fontWeight: "700", lineHeight: 26, marginTop: 14 },
  heading: { ...flowText, color: C.ink, fontSize: 22, fontWeight: "700", lineHeight: 30, marginTop: 14 },
  subtitle: { ...flowText, color: C.muted, fontSize: 12, fontWeight: "400", lineHeight: 18, marginTop: 7 },
  active: { backgroundColor: C.ink, borderRadius: 24, height: 130, paddingHorizontal: 18, paddingVertical: 16, marginTop: 28 },
  activeTitle: { ...flowText, color: C.white, fontSize: 16, fontWeight: "700", lineHeight: 22, marginTop: 9 },
  activeSub: { ...flowText, color: "#D3E5E0", fontSize: 11, fontWeight: "400", lineHeight: 16, marginTop: 4 },
  section: { ...flowText, color: C.ink, fontSize: 18, fontWeight: "700", lineHeight: 26, marginTop: 20, marginBottom: 14 },
  tile: { backgroundColor: C.white, borderRadius: 20, minHeight: 100, paddingHorizontal: 14, paddingVertical: 17,
    flexDirection: "row", gap: 14, alignItems: "center", marginBottom: 14 },
  tileHeading: { ...flowText, color: C.ink, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  tileSub: { ...flowText, color: C.muted, fontSize: 11, fontWeight: "400", lineHeight: 17, marginTop: 4 },
  tileLink: { ...flowText, color: "#0D6960", fontSize: 10, fontWeight: "700", marginTop: 6, textAlign: "right" },
});

export function MyCareScreen({ d, go, nav, shell }: ScreenProps) {
  if (careTestingEnabled) return <SafeAreaView style={c.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={C.canvas} />
    <ScrollView style={{ flex: 1 }} contentContainerStyle={c.content} showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {Platform.OS === "web" && <View style={c.status} accessibilityElementsHidden>
        <Text style={c.statusText}>9:41</Text><Text style={c.statusText}>◉  ▰  ◒</Text>
      </View>}
      <Text style={c.brand}>ALIENTO</Text>
      <Text style={c.heading}>Your care, in one place.</Text>
      <Text style={c.subtitle}>Health brief, review progress and replies.</Text>
      <CareConnection showHeading={false} />
    </ScrollView>
    {nav("care")}
  </SafeAreaView>;
  const items: { title: string; subtitle: string; glyph: string; page: "pending" | "pharmacy" | "order" }[] = [
    { title: "Appointments", subtitle: "No appointment confirmed yet", glyph: "◷", page: "pending" },
    { title: "Prescriptions", subtitle: "Clinician-approved items only", glyph: "◒", page: "pharmacy" },
    { title: "Medicine orders", subtitle: "Preview future delivery updates", glyph: "▤", page: "order" },
  ];
  return <SafeAreaView style={c.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={C.canvas} />
    <ScrollView style={{ flex: 1 }} contentContainerStyle={c.content} showsVerticalScrollIndicator={false}>
      {Platform.OS === "web" && <View style={c.status} accessibilityElementsHidden>
        <Text style={c.statusText}>9:41</Text><Text style={c.statusText}>◉  ▰  ◒</Text>
      </View>}
      <Text style={c.brand}>ALIENTO</Text>
      <Text style={c.heading}>Your care, in one place.</Text>
      <Text style={c.subtitle}>Health briefs, appointments and follow-ups.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="View sample health brief"
        onPress={() => go("summary")} style={c.active}>
        <FlowBadge text="LOCAL DEMO" background={C.mint} color={C.ink} />
        <Text style={c.activeTitle}>Health brief  ↗</Text>
        <Text style={c.activeSub} numberOfLines={1}>{d.symptoms.trim() ? "Sample check-in ready to review" : "No sample brief prepared yet"}</Text>
      </Pressable>
      <Text style={c.section}>Your activity</Text>
      {items.map(item => <Pressable key={item.title} accessibilityRole="button"
        accessibilityLabel={"Preview " + item.title} onPress={() => go(item.page)} style={c.tile}>
        <View style={{ height: 48, width: 48, alignItems: "center", justifyContent: "center" }}>
          <Image source={require("../../assets/figma/care-activity.png")} resizeMode="contain"
            style={{ position: "absolute", width: 48, height: 48 }} />
          <Text style={{ ...flowText, color: "#0D6960", fontSize: 22 }}>{item.glyph}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={c.tileHeading}>{item.title}</Text>
          <Text style={c.tileSub}>{item.subtitle}</Text>
          <Text style={c.tileLink}>View</Text>
        </View>
      </Pressable>)}
      <FlowAction color={C.mint} label="Start a health check" onPress={() => go("voice")}
        style={{ marginTop: 18, minHeight: 54, borderRadius: 18 }} />
      <Text style={{ ...flowText, fontSize: 11, color: C.muted, lineHeight: 17, marginTop: 15 }}>
        Sample activity only. No appointment, prescription or medicine order is connected.
      </Text>
    </ScrollView>
    {nav("care")}
  </SafeAreaView>;
}
