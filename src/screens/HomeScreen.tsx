import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function HomeScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content" backgroundColor={C.canvas} /><ScrollView contentContainerStyle={[s.content, { paddingTop: 12, paddingBottom: 18 }]} showsVerticalScrollIndicator={false}>
      <BrandHeader onProfile={() => go("profile")} /><View style={{ height: 22 }} /><Text style={s.greeting}>Good day{d.name.trim() ? ", " + d.name.trim().split(" ")[0] : ""}.</Text><Text style={s.homeSubtitle}>Let's make your next care step clearer.</Text>
      <View style={s.hero}><View style={{ flex: 1 }}><Tag tone="dark">YOUR CARE, YOUR WORDS</Tag><Text style={s.heroTitle}>How are you feeling today?</Text><Text style={s.heroBody}>Speak freely or type what you want a care professional to know.</Text><Btn title="Start a health check  →" onPress={() => go("voice")} /></View><View style={s.heroGlow}><Logo size={75} /></View></View>
      <Pressable onPress={() => go("urgent")} style={s.emergency}><View style={s.emergencyIcon}><Text style={{ color: C.danger, fontSize: 20, fontWeight: "900" }}>!</Text></View><View style={{ flex: 1 }}><Text style={s.emergencyTitle}>Need urgent help?</Text><Text style={s.emergencyBody}>Know when to seek immediate in-person care.</Text></View><Text style={{ color: C.danger, fontSize: 24 }}>›</Text></Pressable>
      <View style={s.sectionHead}><Text style={s.sectionTitle}>Your care thread</Text><Pressable onPress={() => go("mycare")}><Text style={s.link}>View all</Text></Pressable></View>
      <Card><View style={s.inlineBetween}><Text style={s.cardTitle}>Health check</Text><Tag tone="violet">DEMO</Tag></View><Text style={s.cardBody}>Your health brief can be reviewed, corrected and shared only after the real service verifies your account and records your consent.</Text><Divider /><Pressable onPress={() => go("summary")} style={s.rowLink}><Text style={s.rowLinkText}>Continue sample health brief</Text><Text style={s.link}>→</Text></Pressable></Card>
      <View style={s.sectionHead}><Text style={s.sectionTitle}>Designed around you</Text></View><View style={s.miniGrid}><View style={s.miniCard}><Text style={s.miniGlyph}>◌</Text><Text style={s.miniTitle}>Your language</Text><Text style={s.miniBody}>{d.language}</Text></View><View style={s.miniCard}><Text style={s.miniGlyph}>◈</Text><Text style={s.miniTitle}>Your privacy</Text><Text style={s.miniBody}>Consent comes first</Text></View></View>
    </ScrollView>{nav("home")}</SafeAreaView>;
}
