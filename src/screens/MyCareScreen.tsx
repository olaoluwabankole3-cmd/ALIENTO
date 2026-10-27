import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function MyCareScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return <>{shell("My care", <><BrandHeader onProfile={() => go("profile")} /><Heading eyebrow="YOUR SPACE" title="Your care, in one place." body="This overview contains demo states only. No medical record or appointment is connected." /><Card><View style={s.inlineBetween}><Text style={s.cardTitle}>Health brief</Text><Tag tone="violet">LOCAL DEMO</Tag></View><Text style={s.cardBody}>{d.symptoms.trim() || "Start a health check to create a sample brief."}</Text><Divider /><Btn title="Start a health check" onPress={() => go("voice")} /></Card><Card><Text style={s.cardTitle}>Care request</Text><Status title="Waiting for review" body="Simulated — no clinician notified" /><Pressable onPress={() => go("pending")}><Text style={s.link}>View demo status  →</Text></Pressable></Card><Card><Text style={s.cardTitle}>Orders and delivery</Text><Text style={s.cardBody}>No real order exists. See how a future fulfilment flow could look.</Text><Pressable onPress={() => go("order")}><Text style={s.link}>Preview order flow  →</Text></Pressable></Card></>, "care")}</>;
}
