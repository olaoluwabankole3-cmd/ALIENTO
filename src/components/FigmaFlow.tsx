import React from "react";
import { Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { C } from "../theme/tokens";

const font = Platform.OS === "web" ? "Manrope" : undefined;
export const flowText = { fontFamily: font };
const f = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas },
  content: { paddingHorizontal: 24, paddingTop: Platform.OS === "web" ? 16 : 18, paddingBottom: 30 },
  status: { flexDirection: "row", justifyContent: "space-between", height: 24, alignItems: "center" },
  statusText: { fontFamily: font, fontSize: 12, color: C.ink, fontWeight: "600" },
  header: { flexDirection: "row", alignItems: "center", gap: 12, height: 48, marginTop: Platform.OS === "web" ? 14 : 4, marginBottom: 24 },
  back: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: C.border, backgroundColor: C.white, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontFamily: font, color: C.text, fontSize: 18, lineHeight: 24, fontWeight: "600" },
  headerStep: { fontFamily: font, color: C.muted, fontSize: 12, lineHeight: 18, fontWeight: "500" },
  action: { minHeight: 58, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 12 },
  actionText: { fontFamily: font, fontSize: 15, lineHeight: 22, fontWeight: "700", color: C.ink, textAlign: "center" },
  pill: { minHeight: 36, borderRadius: 18, backgroundColor: C.white, paddingHorizontal: 9, alignItems: "center", justifyContent: "center" },
  pillText: { color: C.text, fontFamily: font, fontWeight: "600", fontSize: 12, lineHeight: 16 },
});

export function FlowScreen({ title, step, back, children, footer }: {
  title: string; step: string; back: () => void; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return <SafeAreaView style={f.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={C.canvas} />
    <ScrollView style={{ flex: 1 }} contentContainerStyle={f.content}
      keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {Platform.OS === "web" && <View style={f.status} accessibilityElementsHidden>
        <Text style={f.statusText}>9:41</Text><Text style={f.statusText}>◉  ▰  ◒</Text>
      </View>}
      <View style={f.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={back} style={f.back}>
          <Image source={require("../../assets/figma/back.png")} resizeMode="contain" style={{ width: 24, height: 24 }} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={f.headerTitle}>{title}</Text>
          <Text style={f.headerStep}>{step}</Text>
        </View>
      </View>
      {children}
    </ScrollView>
    {footer}
  </SafeAreaView>;
}

export function FlowAction({ label, onPress, color = C.lime, disabled = false, style }: {
  label: string; onPress: () => void; color?: string; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
    onPress={onPress} style={({ pressed }) => [f.action, { backgroundColor: color }, style,
      pressed && { opacity: 0.85 }, disabled && { opacity: 0.45 }]}>
    <Text style={f.actionText}>{label}</Text>
  </Pressable>;
}

export function FlowChoice({ label, selected, onPress, style }: {
  label: string; selected: boolean; onPress: () => void; style?: StyleProp<ViewStyle>;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ selected }} onPress={onPress}
    style={({ pressed }) => [f.pill, selected && { backgroundColor: C.mint }, style,
      pressed && { opacity: 0.8 }]}>
    <Text style={[f.pillText, selected && { color: C.ink }]}>{label}</Text>
  </Pressable>;
}

export function FlowBadge({ text, background = C.mist, color = C.ink }: {
  text: string; background?: string; color?: string;
}) {
  return <View style={{ alignSelf: "flex-start", paddingHorizontal: 15, minHeight: 30,
    backgroundColor: background, borderRadius: 18, justifyContent: "center" }}>
    <Text style={{ fontFamily: font, fontSize: 11, lineHeight: 15, fontWeight: "700", color }}>{text}</Text>
  </View>;
}
