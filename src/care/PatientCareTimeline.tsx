import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { C } from "../theme/tokens";
import type { CareCase } from "./client";

const font = Platform.OS === "web" ? "Manrope" : undefined;
const ui = StyleSheet.create({
  hero: { backgroundColor: C.ink, borderRadius: 24, minHeight: 130,
    paddingHorizontal: 18, paddingVertical: 16, marginTop: 24 },
  badge: { alignSelf: "flex-start", backgroundColor: C.mint, borderRadius: 14, paddingHorizontal: 16,
    minHeight: 28, justifyContent: "center" },
  badgeText: { fontFamily: font, color: C.ink, fontSize: 10, fontWeight: "700" },
  heroTitle: { fontFamily: font, color: C.white, fontSize: 16, fontWeight: "700", marginTop: 10 },
  heroSub: { fontFamily: font, color: "#D3E5E0", fontSize: 11, lineHeight: 18, marginTop: 7 },
  heading: { fontFamily: font, color: C.ink, fontSize: 18, fontWeight: "700", marginTop: 22, marginBottom: 14 },
  tile: { minHeight: 100, borderRadius: 20, backgroundColor: C.white, marginBottom: 14,
    paddingHorizontal: 14, paddingVertical: 17, flexDirection: "row", alignItems: "center", gap: 14 },
  tileTitle: { fontFamily: font, color: C.ink, fontWeight: "700", fontSize: 14, lineHeight: 20 },
  tileSub: { fontFamily: font, color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
  tileLink: { fontFamily: font, color: "#0D6960", fontSize: 10, fontWeight: "700",
    textAlign: "right", marginTop: 6 },
  response: { backgroundColor: C.mist, borderRadius: 18, padding: 16, marginTop: 2, marginBottom: 15 },
  responseTitle: { fontFamily: font, color: C.ink, fontSize: 13, fontWeight: "700" },
  responseBody: { fontFamily: font, color: C.text, fontSize: 13, lineHeight: 20, marginTop: 8 },
  refresh: { borderRadius: 18, minHeight: 54, justifyContent: "center", alignItems: "center",
    backgroundColor: C.mint, marginTop: 18, paddingHorizontal: 16 },
  refreshText: { fontFamily: font, fontSize: 15, fontWeight: "700", color: C.ink },
  foot: { fontFamily: font, color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 12 },
});

export function PatientCareTimeline({ cases, busy, onRefresh }: {
  cases: CareCase[]; busy: boolean; onRefresh: () => void;
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  return <View>
    {cases.length === 0 && <View style={ui.response}>
      <Text style={ui.responseTitle}>No submitted health briefs yet</Text>
      <Text style={ui.responseBody}>Submit a fictional brief through the connected test flow.
        Your confirmed cases will appear here.</Text>
    </View>}
    {cases.map(item => {
      const level = item.stage === "reviewed" ? 3 : item.stage === "assigned" ? 2 : 1;
      const ref = item.case_id.slice(-8).toUpperCase();
      const details = [
        { name: "1 · Submitted", detail: "Brief and consent securely recorded", glyph: "◷" },
        { name: "2 · Assigned", detail: level >= 2 ? "A clinician has been assigned" : "Waiting for a clinician assignment", glyph: "◒" },
        { name: "3 · Response", detail: level >= 3 ? "Clinician response available" : "No clinician response recorded yet", glyph: "▤" },
      ];
      return <View key={item.case_id}>
        <View style={ui.hero}>
          <View style={ui.badge}><Text style={ui.badgeText}>CONNECTED TEST</Text></View>
          <Text style={ui.heroTitle}>Health brief · {ref}</Text>
          <Text style={ui.heroSub}>Latest stage · {item.stage === "reviewed" ? "Reviewed" :
            item.stage === "assigned" ? "Assigned to clinician" : "Submitted for assignment"}</Text>
        </View>
        <Text style={ui.heading}>Your care journey</Text>
        {details.map((step, i) => {
          const open = expanded === item.case_id + ":" + i;
          return <View key={step.name}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }}
              accessibilityLabel={step.name + ". " + step.detail}
              onPress={() => setExpanded(open ? null : item.case_id + ":" + i)} style={ui.tile}>
              <View style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
                <Image source={require("../../assets/figma/care-activity.png")} resizeMode="contain"
                  style={{ width: 48, height: 48, position: "absolute" }} />
                <Text style={{ fontSize: 22, color: "#0D6960" }}>{step.glyph}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={ui.tileTitle}>{step.name}{level > i ? "  ✓" : ""}</Text>
                <Text style={ui.tileSub}>{step.detail}</Text>
                <Text style={ui.tileLink}>{open ? "Hide" : "View"} details</Text>
              </View>
            </Pressable>
            {open && <View style={ui.response}>
              <Text style={ui.responseTitle}>{step.name}</Text>
              <Text style={ui.responseBody}>{i === 0
                ? "Received " + new Date(item.submitted_at).toLocaleDateString() + ". Reference: " + item.case_id
                : i === 1 ? step.detail + ". The clinical team has not confirmed an appointment."
                : level >= 3 ? item.outcome || "The review is marked complete, but no response text was returned."
                : step.detail}</Text>
            </View>}
          </View>;
        })}
        {item.stage === "reviewed" && item.outcome && <View style={ui.response}>
          <Text style={ui.responseTitle}>Clinician's response</Text>
          <Text selectable style={ui.responseBody}>{item.outcome}</Text>
        </View>}
      </View>;
    })}
    <Pressable accessibilityRole="button" disabled={busy} onPress={onRefresh}
      style={[ui.refresh, busy && { opacity: 0.6 }]}>
      <Text style={ui.refreshText}>{busy ? "Refreshing…" : "Refresh care status"}</Text>
    </Pressable>
    <Text style={ui.foot}>Updates are fetched when you open My Care or tap refresh.
      This test workflow does not provide real-time emergency support.</Text>
  </View>;
}
