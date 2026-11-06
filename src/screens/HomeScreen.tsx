import React from "react";
import { Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { C } from "../theme/tokens";
import { BottomNav, Logo } from "../components/ui";
import type { ScreenProps } from "./types";

// This is the approved ALIENTO / 01 Home composition from Figma (9:21).
// The patient flow remains interactive; no real clinical service is implied.
const font = Platform.OS === "web" ? "Manrope" : undefined;

const h = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  body: { paddingHorizontal: 24, paddingTop: Platform.OS === "web" ? 16 : 18, paddingBottom: 24 },
  status: { height: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusText: { color: C.ink, fontFamily: font, fontSize: 12, fontWeight: "600" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, marginBottom: 22, minHeight: 44 },
  wordmark: { color: C.ink, fontFamily: font, fontWeight: "700", fontSize: 20, lineHeight: 26 },
  profile: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.ink, alignItems: "center", justifyContent: "center" },
  hero: { height: 310, backgroundColor: C.ink, borderRadius: 30, padding: 22, overflow: "hidden" },
  heroGreeting: { color: C.mint, fontFamily: font, fontSize: 14, fontWeight: "500", lineHeight: 20 },
  heroTitle: { color: C.white, fontFamily: font, fontSize: 30, lineHeight: 38, fontWeight: "700", marginTop: 8, maxWidth: 290, letterSpacing: -0.45 },
  heroBody: { color: C.white, opacity: 0.78, fontFamily: font, fontSize: 14, fontWeight: "400", lineHeight: 21, marginTop: 13, maxWidth: 255 },
  heroCta: { position: "absolute", left: 22, bottom: 42, color: C.mint, fontFamily: font, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  languages: { position: "absolute", left: 22, bottom: 17, color: "#B3C5C1", fontFamily: font, fontSize: 12, lineHeight: 18 },
  emblem: { position: "absolute", bottom: 20, right: 14 },
  orb: { position: "absolute", right: 20, top: 18, width: 108, height: 108, borderRadius: 54, backgroundColor: "#0B4840", opacity: 0.7 },
  orbSmall: { position: "absolute", right: 14, top: 72, width: 66, height: 66, borderRadius: 33, backgroundColor: C.lime, opacity: 0.5 },
  emergency: { height: 62, flexDirection: "row", alignItems: "center", backgroundColor: C.dangerSoft, borderRadius: 20, paddingHorizontal: 16, marginTop: 18, gap: 10 },
  emergencyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.danger },
  emergencyHeading: { color: C.danger, fontFamily: font, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  emergencyBody: { color: C.muted, fontFamily: font, fontSize: 11, fontWeight: "500", lineHeight: 16 },
  sectionHeading: { marginTop: 30, marginBottom: 14, color: C.text, fontFamily: font, fontSize: 18, fontWeight: "600", lineHeight: 26 },
  timeline: { height: 168, paddingLeft: 47, paddingTop: 24, paddingRight: 16, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 24 },
  timelineLine: { position: "absolute", left: 27, top: 28, height: 112, width: 3, backgroundColor: C.mist, borderRadius: 3 },
  point: { position: "absolute", left: 20, width: 14, height: 14, borderRadius: 7 },
  item: { height: 48 },
  itemTitle: { color: C.text, fontFamily: font, fontWeight: "600", fontSize: 13, lineHeight: 18 },
  itemBody: { color: C.muted, fontFamily: font, fontWeight: "500", fontSize: 11, lineHeight: 16, marginTop: 2 },
});

export function HomeScreen({ d, go, nav }: ScreenProps) {
  return <SafeAreaView style={h.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={C.canvas} />
    <ScrollView style={{ flex: 1 }} contentContainerStyle={h.body} showsVerticalScrollIndicator={false}>
      {Platform.OS === "web" && <View style={h.status} accessibilityElementsHidden>
        <Text style={h.statusText}>9:41</Text><Text style={h.statusText}>◉  ▰  ◒</Text>
      </View>}
      <View style={h.header}>
        <Text style={h.wordmark}>ALIENTO</Text>
        <Pressable accessibilityLabel="Open profile" accessibilityRole="button" style={h.profile} onPress={() => go("profile")}>
          <View style={{ width: 9, height: 9, borderRadius: 5, borderWidth: 1.8, borderColor: C.white, marginBottom: 2 }} />
          <View style={{ width: 17, height: 9, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderWidth: 1.8, borderBottomWidth: 0, borderColor: C.white }} />
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Start a health check" onPress={() => go("voice")} style={h.hero}>
        <View style={h.orb} /><View style={h.orbSmall} />
        <Text style={h.heroGreeting}>Good morning.</Text>
        <Text style={h.heroTitle}>How does your{"\n"}body feel today?</Text>
        <Text style={h.heroBody}>Speak naturally. ALIENTO prepares a clear brief for clinician review.</Text>
        <View style={h.emblem}><Logo size={122} /></View>
        <Text style={h.heroCta}>Tap to speak</Text>
        <Text style={h.languages}>{d.language === "Pidgin" ? "Pidgin • English" : "English • Pidgin"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="View urgent help guidance" onPress={() => go("urgent")} style={h.emergency}>
        <View style={h.emergencyDot} />
        <View style={{ flex: 1 }}>
          <Text style={h.emergencyHeading}>Need urgent help?</Text>
          <Text style={h.emergencyBody} numberOfLines={1}>Breathing trouble, fainting, severe pain…</Text>
        </View>
      </Pressable>
      <Text style={h.sectionHeading}>Your care thread</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="View My Care" onPress={() => go("mycare")} style={h.timeline}>
        <View style={h.timelineLine} />
        <View style={[h.point, { top: 27, backgroundColor: C.mint }]} />
        <View style={[h.point, { top: 75, backgroundColor: C.mist }]} />
        <View style={[h.point, { top: 123, backgroundColor: C.mist }]} />
        <View style={h.item}><Text style={h.itemTitle}>Health check</Text><Text style={h.itemBody}>Start when you feel unwell</Text></View>
        <View style={h.item}><Text style={h.itemTitle}>Clinician</Text><Text style={h.itemBody}>A licensed professional reviews it</Text></View>
        <View style={h.item}><Text style={h.itemTitle}>Medicine</Text><Text style={h.itemBody}>Pharmacy + delivery when needed</Text></View>
      </Pressable>
    </ScrollView>
    {nav("home")}
  </SafeAreaView>;
}
