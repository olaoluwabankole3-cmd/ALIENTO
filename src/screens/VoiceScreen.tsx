import React from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import { FlowAction, FlowBadge, FlowScreen, flowText } from "../components/FigmaFlow";
import { initial } from "../domain/patient";
import type { ScreenProps } from "./types";

const bars = [18, 28, 42, 54, 34, 68, 44, 26, 58, 38, 22, 46, 30];
const v = StyleSheet.create({
  heading: { ...flowText, fontWeight: "700", fontSize: 30, lineHeight: 40, color: C.text },
  subtitle: { ...flowText, fontSize: 14, lineHeight: 22, fontWeight: "500", color: C.muted, marginTop: 8, marginBottom: 6, minHeight: 44 },
  panel: { height: 380, backgroundColor: C.ink, borderRadius: 32, overflow: "hidden" },
  circle: { position: "absolute", left: "50%" },
  wave: { position: "absolute", top: 235, left: 25, right: 25, height: 68, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" },
  time: { ...flowText, fontSize: 14, fontWeight: "600", lineHeight: 20, color: C.white, textAlign: "center", position: "absolute", left: 0, right: 0, top: 316 },
  caption: { ...flowText, fontSize: 12, lineHeight: 18, color: "#B2C4C0", textAlign: "center", position: "absolute", left: 0, right: 0, top: 345 },
  label: { ...flowText, color: C.violet, fontSize: 12, fontWeight: "600", lineHeight: 18, marginTop: 28, marginBottom: 8 },
  transcript: { ...flowText, minHeight: 92, backgroundColor: C.aiMist, color: C.text, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 18, fontSize: 14, lineHeight: 22, textAlignVertical: "top" },
  hint: { ...flowText, color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 12, textAlign: "center" },
});

export function VoiceScreen({ d, patch, go, back, voicePreviewActive, setVoicePreviewActive }: ScreenProps) {
  const hasWords = d.symptoms.trim().length > 0;
  return <FlowScreen title="Talk to ALIENTO" step="Step 1 • Voice preview" back={back}>
    <Text style={v.heading}>Say it your way.</Text>
    <Text style={v.subtitle}>No forms. No medical words. Just describe what you feel.</Text>
    <View style={v.panel}>
      <View style={{ position: "absolute", top: 20, left: 20 }}>
        <FlowBadge text="VOICE PREVIEW · MIC OFF" background={C.violet} color={C.white} />
      </View>
      <Pressable accessibilityRole="button"
        accessibilityLabel="Toggle example waveform. Microphone remains off."
        accessibilityState={{ expanded: voicePreviewActive }}
        onPress={() => setVoicePreviewActive(a => !a)}
        style={{ position: "absolute", left: 0, right: 0, top: 88, height: 152, alignItems: "center", justifyContent: "center" }}>
        <Image source={require("../../assets/figma/ring-large.png")} resizeMode="contain" style={{ width: 152, height: 152, position: "absolute" }} />
        <Image source={require("../../assets/figma/ring-mid.png")} resizeMode="contain" style={{ width: 118, height: 118, position: "absolute" }} />
        <Image source={require("../../assets/figma/ring-inner.png")} resizeMode="contain" style={{ width: 82, height: 82, position: "absolute" }} />
        <Image source={require("../../assets/figma/microphone.png")} resizeMode="contain" style={{ width: 34, height: 34 }} />
      </Pressable>
      <View style={[v.wave, { opacity: voicePreviewActive ? 1 : 0.75 }]}>
        {bars.map((height, i) => <View key={i} style={{ width: 5, borderRadius: 3, height,
          backgroundColor: i % 4 === 0 ? C.lime : C.mint }} />)}
      </View>
      <Text style={v.time}>00:18 · sample</Text>
      <Text style={v.caption}>{voicePreviewActive ? "Sample waveform shown" : "Tap the pulse to preview the waveform"}</Text>
    </View>
    <Text style={v.label}>Sample transcript — edit with fictional details</Text>
    <TextInput accessibilityLabel="Fictional health concern" multiline
      value={d.symptoms} onChangeText={symptoms => patch({ symptoms })}
      placeholder="Type an example concern…" placeholderTextColor={C.muted} style={v.transcript} />
    <FlowAction style={{ marginTop: 20 }} label={hasWords ? "Continue with this brief" : "Insert a sample brief"}
      onPress={() => hasWords ? go("followup") : patch({ symptoms: initial.symptoms })} />
    <Text style={v.hint}>Preview only. No microphone recording, AI transcription or clinical service is active.</Text>
  </FlowScreen>;
}
