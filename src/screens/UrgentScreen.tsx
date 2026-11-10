import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function UrgentScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Urgent guidance", <><View style={s.urgentHero}><Text style={s.urgentIcon}>!</Text><Text style={s.urgentTitle}>Please put your safety first.</Text><Text style={s.urgentBody}>{urgentCopy}</Text></View><Note title="This app cannot assess emergencies" body="Do not wait for a response from ALIENTO if symptoms are severe, sudden or life-threatening." tone="danger" /><Card><Text style={s.cardTitle}>What to do now</Text><Text style={s.cardBody}>Seek appropriate urgent in-person help. If it is safe to do so, ask someone nearby to support you. Do not rely on this prototype to decide whether an emergency is present.</Text></Card><Btn title="Return to home" onPress={() => go("home")} variant="dark" /></>);
}
