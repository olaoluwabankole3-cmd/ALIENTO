import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import type { Answer, Spot } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function FollowUpScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
const severe = isUrgentAnswer(d.severe);
  return shell("A few follow-up questions", <><View style={s.progress}><View style={[s.progressBit, s.progressActive]} /><View style={[s.progressBit, s.progressActive]} /><View style={s.progressBit} /><View style={s.progressBit} /><Text style={s.progressText}>2 OF 4</Text></View><Heading eyebrow="LET'S CLARIFY" title="A little more context." body="These questions organise what you reported. They do not produce a diagnosis." />
      <Card><Text style={s.cardTitle}>When did this start?</Text><View style={s.chipWrap}>{["Today", "Since yesterday", "2–3 days", "More than 3 days", "Not sure"].map(x => <Choice key={x} label={x} selected={d.duration === x} onPress={() => patch({ duration: x })} />)}</View></Card>
      <Card><Text style={s.cardTitle}>Have you been vomiting?</Text><View style={s.chipWrap}>{(["No", "Yes", "Not sure"] as Answer[]).map(x => <Choice key={x} label={x} selected={d.vomiting === x} onPress={() => patch({ vomiting: x })} />)}</View></Card>
      <Card><Text style={s.cardTitle}>Are you experiencing a severe or sudden symptom right now?</Text><Text style={s.cardBody}>For example, serious difficulty breathing, fainting or severe chest pain.</Text><View style={s.chipWrap}>{(["No", "Yes", "Not sure"] as Answer[]).map(x => <Choice key={x} label={x} selected={d.severe === x} onPress={() => patch({ severe: x })} />)}</View></Card>
      {severe ? <Note title="Please don't wait for this app" body={urgentCopy} tone="danger" /> : null}<Btn title={severe ? "View urgent guidance  →" : "Review my health brief  →"} onPress={() => go(getFollowUpDestination(d.severe))} /></>);
}
