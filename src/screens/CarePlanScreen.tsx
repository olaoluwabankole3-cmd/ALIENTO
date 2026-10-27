import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function CarePlanScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Consultation & care plan", <><Heading eyebrow="CLINICAL REVIEW · CONCEPT" title="Care should be guided by a qualified professional." body="This example shows how a reviewed care plan could appear. It is not a clinical assessment or personal medical advice." /><Card><Tag tone="violet">SIMULATED REVIEW</Tag><Text style={[s.cardTitle, { marginTop: 12 }]}>Care plan preview</Text><Text style={s.cardBody}>A real clinician would explain their assessment, next steps, any follow-up and whether a prescription is appropriate. Nothing has been issued by this demo.</Text><Divider /><Text style={s.cardTitle}>Choose a demo path</Text><Btn title="Preview pharmacy flow (simulated)" onPress={() => go("pharmacy")} /><Btn title="Continue without medicine" variant="secondary" onPress={() => go("mycare")} /></Card><Note title="No medicine purchase required" body="In production, a clinician decides whether a prescription is appropriate. Patients are never required to purchase medicine." /></>);
}
