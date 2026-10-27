import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function ProfileScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Profile & preferences", <><Heading eyebrow="YOUR ALIENTO" title="Your experience, your choices." body="Profile settings are saved only in this demo's current app state." /><Card><Text style={s.cardTitle}>Language</Text><View style={s.chipWrap}><Choice label="English" selected={d.language === "English"} onPress={() => patch({ language: "English" })} /><Choice label="Nigerian Pidgin" selected={d.language === "Pidgin"} onPress={() => patch({ language: "Pidgin" })} /></View><Text style={s.hint}>Language preference is saved locally. Full translation still needs implementation.</Text></Card><Card><View style={s.inlineBetween}><View style={{ flex: 1 }}><Text style={s.cardTitle}>Notifications</Text><Text style={s.cardBody}>Demo preference only; no SMS or push notifications will be sent.</Text></View><Switch value={d.notifications} onValueChange={v => patch({ notifications: v })} trackColor={{ false: "#CCD8D2", true: C.mint }} thumbColor={C.white} /></View></Card><Card><Text style={s.cardTitle}>Privacy & safety</Text><Text style={s.cardBody}>No backend, user account, identity verification, or health record is connected. Do not enter real patient information in this prototype.</Text><Divider /><Pressable onPress={() => go("consent")}><Text style={s.link}>Review consent screen  →</Text></Pressable></Card><Btn title="Return home" onPress={() => go("home")} /></>, "you");
}
