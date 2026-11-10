import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function PharmacyScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Prescription & pharmacy", <><Heading eyebrow="PHARMACY · CONCEPT" title="A prescription must be valid first." body="This preview uses a simulated example. There is no prescription, pharmacy partner or stock connection." /><Card><View style={s.inlineBetween}><Text style={s.cardTitle}>Medicine order</Text><Tag tone="violet">NOT REAL</Tag></View><Text style={s.cardBody}>A real pharmacy would validate the prescription, confirm availability, disclose the final price and explain substitutions before dispensing.</Text><Divider /><Status title="Prescription validation" body="Not connected" /><Status title="Pharmacy stock and price" body="No stock check or quote available" /><Status title="Dispensing" body="No medicine will be dispensed by ALIENTO demo" /></Card><Btn title="Preview order review" onPress={() => go("order")} /><Btn title="Continue without medicine" variant="outline" onPress={() => go("mycare")} /></>);
}
