import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function WelcomeScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return <SafeAreaView style={[s.safe, s.welcome]}><StatusBar barStyle="light-content" backgroundColor={C.ink} /><ScrollView contentContainerStyle={s.welcomeContent} showsVerticalScrollIndicator={false}>
      <View style={s.welcomeBrand}><Logo size={76} /><View><Text style={s.welcomeWordmark}>ALIENTO</Text><Text style={s.welcomeKicker}>A clearer path to care.</Text></View></View>
      <View style={{ height: 62 }} /><Tag tone="dark">VOICE-FIRST CARE</Tag><Text style={s.welcomeTitle}>Care that meets you where you are.</Text><Text style={s.welcomeBody}>Tell your story in your own words. We help organise the details for a qualified care professional to review.</Text>
      <View style={s.welcomeFeatures}><View style={s.featureIcon}><Text style={s.featureGlyph}>≈</Text></View><View style={{ flex: 1 }}><Text style={s.featureTitle}>Speak or type naturally</Text><Text style={s.featureBody}>Start with the words that feel right to you.</Text></View></View>
      <View style={s.welcomeFeatures}><View style={s.featureIcon}><Text style={s.featureGlyph}>✳</Text></View><View style={{ flex: 1 }}><Text style={s.featureTitle}>Keep your care connected</Text><Text style={s.featureBody}>Review the information before it goes anywhere.</Text></View></View>
      <View style={{ marginTop: 26, flexDirection: "row", gap: 9 }}><Choice label="English" selected={d.language === "English"} onPress={() => patch({ language: "English" })} /><Choice label="Nigerian Pidgin" selected={d.language === "Pidgin"} onPress={() => patch({ language: "Pidgin" })} /></View>
      <View style={{ height: 24 }} /><Btn title="Get started  →" onPress={() => go("home")} /><Text style={s.welcomeLegal}>ALIENTO supports care coordination. It is not an AI doctor and does not diagnose or prescribe.</Text>
    </ScrollView></SafeAreaView>;
}
