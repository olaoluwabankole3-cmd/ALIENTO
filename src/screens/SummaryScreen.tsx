import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import { FlowAction, FlowBadge, FlowScreen, flowText } from "../components/FigmaFlow";
import type { ScreenProps } from "./types";

const s = StyleSheet.create({
  heading: { ...flowText, color: C.text, fontSize: 29, lineHeight: 38, fontWeight: "700", marginTop: 18, marginBottom: 24 },
  card: { backgroundColor: C.ink, borderRadius: 30, minHeight: 354, padding: 24, overflow: "hidden" },
  stripe: { position: "absolute", width: 10, height: 92, borderRadius: 5, left: 0, top: 28, backgroundColor: C.mint },
  cardKicker: { ...flowText, color: C.mint, fontSize: 11, lineHeight: 16, fontWeight: "700" },
  label: { ...flowText, color: "#A7C1BB", fontSize: 11, lineHeight: 16, fontWeight: "600", marginTop: 18 },
  value: { ...flowText, color: C.white, fontSize: 15, lineHeight: 22, fontWeight: "600", marginTop: 7 },
  notice: { marginTop: 13, borderRadius: 20, backgroundColor: C.inkSoft, padding: 14 },
  noticeTitle: { ...flowText, color: C.lime, fontSize: 11, fontWeight: "700", lineHeight: 16 },
  noticeCopy: { ...flowText, color: "#C3D9D3", fontSize: 11, lineHeight: 16, fontWeight: "500", marginTop: 3 },
  noteInput: { ...flowText, borderRadius: 14, backgroundColor: C.white, minHeight: 90,
    paddingHorizontal: 12, paddingVertical: 10, color: C.text, fontSize: 13, textAlignVertical: "top" },
  footer: { ...flowText, color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 20 },
});

export function SummaryScreen({ d, patch, go, back, nav }: ScreenProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  return <FlowScreen title="Health brief" step="Step 3 • Review" back={back} footer={nav("care")}>
    <FlowBadge text="●  Brief ready to review" background={C.mist} color={C.ink} />
    <Text style={s.heading}>Your story,{"\n"}clearly organised.</Text>
    <View style={s.card}>
      <View style={s.stripe} />
      <Text style={s.cardKicker}>CARE BRIEF · DEMO</Text>
      <Text style={s.label}>Your own words</Text>
      <Text style={s.value}>{d.symptoms.trim() || "No concern entered yet."}</Text>
      <Text style={s.label}>Duration</Text>
      <Text style={s.value}>{d.duration}</Text>
      <Text style={s.label}>Vomiting</Text>
      <Text style={s.value}>{d.vomiting}</Text>
      {!!d.notes.trim() && <>
        <Text style={s.label}>Other details</Text>
        <Text style={s.value}>{d.notes}</Text>
      </>}
      <View style={s.notice}>
        <Text style={s.noticeTitle}>Not a diagnosis</Text>
        <Text style={s.noticeCopy}>No AI triage or clinical review takes place in this preview. A qualified clinician must assess real submissions.</Text>
      </View>
    </View>
    <View style={{ flexDirection: "row", gap: 10, marginTop: 30 }}>
      <FlowAction label="Edit answers" onPress={() => go("voice")} color={C.white}
        style={{ flex: 1, minHeight: 52, borderWidth: 1, borderColor: C.border, borderRadius: 18 }} />
      <FlowAction label="Continue to consent" onPress={() => go("consent")} color={C.mint}
        disabled={!d.symptoms.trim()} style={{ flex: 1, minHeight: 52, borderRadius: 18 }} />
    </View>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: editingNotes }}
      style={{ marginTop: 14, alignSelf: "flex-start" }}
      onPress={() => setEditingNotes(e => !e)}>
      <Text style={{ ...flowText, fontSize: 12, fontWeight: "600", color: C.inkSoft }}>
        {editingNotes ? "Close additional details" : d.notes.trim() ? "Edit additional details" : "+ Add optional details"}
      </Text>
    </Pressable>
    {editingNotes && <TextInput accessibilityLabel="Optional details for health brief"
      multiline value={d.notes} onChangeText={notes => patch({ notes })} style={[s.noteInput, { marginTop: 12 }]}
      placeholder="Add a fictional detail you want included…" placeholderTextColor={C.muted} />}
    <Text style={s.footer}>You choose what is shared and who can access it. Nothing is sent in the public demo.</Text>
  </FlowScreen>;
}
