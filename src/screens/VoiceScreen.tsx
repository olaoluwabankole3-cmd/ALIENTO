import React from "react";
import { Pressable, Text, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { Btn, Card, Field, Heading } from "../components/ui";
import { initial } from "../domain/patient";
import type { ScreenProps } from "./types";

export function VoiceScreen({ d, patch, go, shell, voicePreviewActive, setVoicePreviewActive }: ScreenProps) {
  const hasWords = Boolean(d.symptoms.trim());
  return shell("Health check", <>
    <View style={s.progress}>
      <View style={[s.progressBit, s.progressActive]} />
      <View style={s.progressBit} /><View style={s.progressBit} /><View style={s.progressBit} />
      <Text style={s.progressText}>1 OF 4</Text>
    </View>
    <Heading eyebrow="YOUR WORDS" title="What brings you here?" body="Use a fictional example. Describe what you noticed and when it started." />
    <Card>
      <Field label="Your main concern" value={d.symptoms} onChange={symptoms => patch({ symptoms })}
        placeholder="For example, I started feeling tired yesterday…" multiline />
      {!hasWords && <Btn title="Try a sample response" variant="secondary" onPress={() => patch({ symptoms: initial.symptoms })} />}
    </Card>
    <Btn title="Continue to follow-up  →" disabled={!hasWords} onPress={() => go("followup")} />
    <Card>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: voicePreviewActive }}
        onPress={() => setVoicePreviewActive(active => !active)} style={s.voicePreview}>
        <View style={[s.voiceButton, voicePreviewActive && s.voiceButtonActive]}>
          <Text style={s.voiceGlyph}>{voicePreviewActive ? "Ⅱ" : "▷"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.cardTitle, { color: C.white }]}>Voice preview</Text>
          <Text style={s.voiceCaption}>{voicePreviewActive ? "Tap to close the waveform." : "See a sample waveform. Your microphone stays off."}</Text>
        </View>
      </Pressable>
      {voicePreviewActive && <View style={s.waveWrap}>
        {[12,22,16,31,20,36,17,26,14,33,21,28,13,23,18,30,15].map((height, i) =>
          <View key={i} style={[s.waveBar, { height }]} />)}
      </View>}
    </Card>
  </>);
}
