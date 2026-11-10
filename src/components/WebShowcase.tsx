import React from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { C } from "../theme/tokens";

/** A desktop companion to the original Figma 412px patient interface.
 * Figma: ALIENTO / Web showcase • judges (node 46:2).
 * Never sends patient information to a service. The embedded patient app owns the journey.
 */
export function WebShowcase({ children, onStartHealthCheck }: {
  children: React.ReactNode;
  onStartHealthCheck: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const gutter = width >= 1450 ? 52 : 28;
  const gap = width >= 1450 ? 58 : 30;
  const leftWidth = Math.max(490, Math.min(780, width - 500 - gap - gutter * 2));
  const phoneHeight = Math.max(680, Math.min(870, height - 112));
  const fontFamily = "Manrope";
  const steps = [
    { number: "01", title: "Describe a concern", description: "Everyday language and guided questions" },
    { number: "02", title: "Review the brief", description: "A clear summary before any sharing" },
    { number: "03", title: "Coordinate care", description: "Case assignment and clinician response workflow" },
  ];

  return <ScrollView style={{ flex: 1, backgroundColor: C.ink }}
    contentContainerStyle={{ minHeight: Math.max(850, height), flexGrow: 1,
      alignItems: "center", justifyContent: "center", paddingHorizontal: gutter, paddingVertical: 36 }}
    showsVerticalScrollIndicator={false}>
    <View style={{ width: "100%", maxWidth: 1540, flexDirection: "row", alignItems: "center",
      justifyContent: "center", gap }}>
      <View style={{ width: leftWidth, paddingTop: 8, paddingBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap",
          gap: 20, marginBottom: 74 }}>
          <Text style={{ fontFamily, fontWeight: "800", fontSize: 25, color: C.mint }}>ALIENTO</Text>
          <Text style={{ fontFamily, fontWeight: "600", fontSize: 11, letterSpacing: 1.3,
            color: "#C5DCD5" }}>INTERACTIVE PROTOTYPE  ·  FICTIONAL DATA</Text>
        </View>
        <View style={{ backgroundColor: C.mist, alignSelf: "flex-start",
          paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 }}>
          <Text style={{ fontFamily, fontWeight: "800", color: C.ink, fontSize: 11,
            letterSpacing: 1 }}>HEALTH & WELLBEING</Text>
        </View>
        <Text style={{ color: C.white, fontFamily, fontWeight: "800", fontSize: width >= 1450 ? 54 : 46,
          lineHeight: width >= 1450 ? 66 : 58, letterSpacing: -1.5, marginTop: 25,
          maxWidth: 740 }}>A clearer path to care.</Text>
        <Text style={{ color: "#D5E7E1", fontFamily, fontWeight: "400", fontSize: 18,
          lineHeight: 28, maxWidth: 675, marginTop: 15 }}>
          From the first health concern to a structured brief and a coordinated review journey.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center",
          gap: 12, marginTop: 28 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Start fictional patient health check"
            onPress={onStartHealthCheck} style={({ pressed }) => ({
              backgroundColor: C.mint, borderRadius: 15, paddingHorizontal: 22,
              minHeight: 55, justifyContent: "center", opacity: pressed ? 0.84 : 1
            })}>
            <Text style={{ color: C.ink, fontFamily, fontSize: 14, fontWeight: "800" }}>
              Explore patient journey  →
            </Text>
          </Pressable>
          <Pressable accessibilityRole="link" accessibilityLabel="Open fictional clinician workspace"
            onPress={() => { if (typeof window !== "undefined") window.location.assign("/clinician?demo=1"); }}
            style={({ pressed }) => ({
              backgroundColor: C.mist, borderRadius: 15, paddingHorizontal: 22,
              minHeight: 55, justifyContent: "center", opacity: pressed ? 0.84 : 1
            })}>
            <Text style={{ color: C.ink, fontFamily, fontSize: 14, fontWeight: "800" }}>
              Clinician workspace  ↗
            </Text>
          </Pressable>
        </View>
        <Text style={{ color: C.mint, fontFamily, fontWeight: "800",
          fontSize: 11, letterSpacing: 1.2, marginTop: 54, marginBottom: 19 }}>THE JOURNEY</Text>
        <View style={{ gap: 14 }}>
          {steps.map(step => <View key={step.number} style={{
            flexDirection: "row", alignItems: "center", gap: 18, minHeight: 58
          }}>
            <View style={{ width: 43, height: 43, borderRadius: 14, backgroundColor: C.mist,
              alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily, fontSize: 13, fontWeight: "800", color: C.ink }}>{step.number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily, fontWeight: "700", color: C.white,
                fontSize: 16, lineHeight: 22 }}>{step.title}</Text>
              <Text style={{ fontFamily, color: "#C2DBD3", fontSize: 12,
                lineHeight: 18, marginTop: 3 }}>{step.description}</Text>
            </View>
          </View>)}
        </View>
        <Text style={{ color: "#A9CEC1", fontFamily, fontSize: 11, lineHeight: 18,
          marginTop: 35, maxWidth: 650 }}>
          Prototype demonstration only. No microphone recording, diagnosis or real clinical service.
          Please do not enter personal health information.
        </Text>
      </View>
      <View style={{ width: 500, padding: 24, borderRadius: 38, backgroundColor: C.mist,
        alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 412, height: phoneHeight, maxHeight: phoneHeight,
          borderRadius: 32, backgroundColor: C.canvas, overflow: "hidden",
          shadowColor: C.ink, shadowOpacity: 0.16, shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 } }}>
          {children}
        </View>
      </View>
    </View>
  </ScrollView>;
}
