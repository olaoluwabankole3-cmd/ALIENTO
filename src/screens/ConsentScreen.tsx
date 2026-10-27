import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function ConsentScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  const ready = isConsentReady(d.name, d.phone, d.saveConsent, d.aiAcknowledged);
      return shell("Verification & consent", <><Heading eyebrow="STEP 4 OF 4" title="Your information stays in your control." body="A real service would verify your account and ask permission before sharing a health brief." /><Card><Text style={s.cardTitle}>About you</Text><Field label="Full name" value={d.name} onChange={v => patch({ name: v })} placeholder="Enter a test name" /><Field label="Phone number" value={d.phone} onChange={v => patch({ phone: v })} placeholder="e.g. 080…" keyboardType="phone-pad" hint="Use a test number. No code will be sent." /></Card><Card><Text style={s.cardTitle}>Your choices</Text><Check checked={d.saveConsent} onPress={() => patch({ saveConsent: !d.saveConsent })} label="I consent to saving and sharing this sample brief for the demo flow." /><Check checked={d.aiAcknowledged} onPress={() => patch({ aiAcknowledged: !d.aiAcknowledged })} label="I understand AI does not diagnose, prescribe or replace a qualified professional." /><Text style={s.hint}>These checkboxes only control this local demo; they are not a legal consent receipt.</Text></Card><Btn title="Preview review status  →" onPress={() => go("pending")} disabled={!ready} /><Btn title="Cancel and return home" variant="outline" onPress={() => go("home")} /></>);
}
