import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function PendingScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Review status", <><View style={s.pendingHero}><View style={s.pendingRing}><Text style={{ fontSize: 30, color: C.violet }}>◷</Text></View><Tag tone="violet">SIMULATED STATUS</Tag><Heading title="Awaiting clinical review" body="This is a sample screen. No clinician has received your information and no appointment has been booked." /></View><Card><Status title="Health brief prepared" body="Sample details are held in local screen state." done /><Status title="Account verification" body="The production verification service is not connected." /><Status title="Qualified clinician review" body="Not started — no care team is connected." /></Card><Note title="What happens next in a real service?" body="A qualified clinician reviews your information and decides whether consultation, further questions or no prescription is appropriate." /><Btn title="Preview a care-plan scenario" onPress={() => go("careplan")} /><Btn title="Return to home" variant="outline" onPress={() => go("home")} /></>);
}
