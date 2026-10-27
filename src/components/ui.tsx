import React from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import type { TabKey } from "../domain/patient";

export function Logo({ size = 64 }: { size?: number }) {
  return <View accessibilityLabel="ALIENTO brand mark" style={[s.logo, { width: size, height: size, borderRadius: size * 0.24 }]}>
    <Image source={require("../../assets/aliento-mark.jpg")} accessibilityLabel="ALIENTO emerald 3D brand artwork" resizeMode="cover" style={StyleSheet.absoluteFill} />
  </View>;
}
export function Btn({ title, onPress, variant = "primary", disabled = false }: { title: string; onPress: () => void; variant?: "primary" | "secondary" | "outline" | "dark" | "danger"; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, ({ primary: s.button_primary, secondary: s.button_secondary, outline: s.button_outline, dark: s.button_dark, danger: s.button_danger } as const)[variant], disabled && s.disabled, pressed && !disabled && s.pressed]}>
    <Text style={[s.buttonText, ({ primary: s.buttonText_primary, secondary: s.buttonText_secondary, outline: s.buttonText_outline, dark: s.buttonText_dark, danger: s.buttonText_danger } as const)[variant]]}>{title}</Text>
  </Pressable>;
}
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) { return <View style={[s.card, style]}>{children}</View>; }
export function Tag({ children, tone = "mint" }: { children: React.ReactNode; tone?: "mint" | "violet" | "danger" | "dark" | "neutral" }) {
  return <View style={[s.tag, { backgroundColor: tone === "violet" ? C.aiMist : tone === "danger" ? C.dangerSoft : tone === "dark" ? "#17413B" : tone === "neutral" ? "#EEF3F0" : C.mist }]}>
    <Text style={[s.tagText, { color: tone === "violet" ? C.violet : tone === "danger" ? C.danger : tone === "dark" ? C.mint : tone === "neutral" ? C.muted : C.inkSoft }]}>{children}</Text>
  </View>;
}
export function Note({ title, body, tone = "neutral" }: { title: string; body: string; tone?: "neutral" | "danger" | "violet" | "mint" }) {
  const bg = tone === "danger" ? C.dangerSoft : tone === "violet" ? C.aiMist : tone === "mint" ? C.mist : C.surface;
  const accent = tone === "danger" ? C.danger : tone === "violet" ? C.violet : C.inkSoft;
  return <View style={[s.note, { backgroundColor: bg, borderColor: tone === "danger" ? "#FFD8DE" : tone === "violet" ? "#DCD7FF" : C.border }]}>
    <View style={[s.noteDot, { backgroundColor: accent }]} />
    <View style={{ flex: 1 }}><Text style={[s.noteTitle, { color: accent }]}>{title}</Text><Text style={s.noteBody}>{body}</Text></View>
  </View>;
}
export function Field({ label, value, onChange, placeholder, multiline = false, keyboardType = "default", hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: "default" | "phone-pad"; hint?: string }) {
  return <View style={s.fieldWrap}><Text style={s.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#8A9A96" keyboardType={keyboardType} multiline={multiline} textAlignVertical={multiline ? "top" : "center"} style={[s.input, multiline && s.multiline]} />{hint ? <Text style={s.hint}>{hint}</Text> : null}</View>;
}
export function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[s.choice, selected && s.choiceSelected]}><Text style={[s.choiceText, selected && s.choiceTextSelected]}>{label}</Text></Pressable>;
}
export function Check({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={s.checkRow}><View style={[s.check, checked && s.checkOn]}><Text style={{ color: C.ink, fontWeight: "900" }}>{checked ? "✓" : ""}</Text></View><Text style={s.checkText}>{label}</Text></Pressable>;
}
export function Top({ title, back, dark = false }: { title: string; back: () => void; dark?: boolean }) {
  return <View style={s.top}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={back} style={[s.back, dark && { backgroundColor: "#123A34", borderColor: "#25534B" }]}><Text style={{ color: dark ? C.white : C.ink, fontSize: 23 }}>‹</Text></Pressable><Text style={[s.topTitle, dark && { color: C.white }]} numberOfLines={1}>{title}</Text><Tag tone={dark ? "dark" : "mint"}>DEMO</Tag></View>;
}
export function BrandHeader({ onProfile }: { onProfile: () => void }) {
  return <View style={s.brandHeader}><View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}><Logo size={44} /><View><Text style={s.wordmark}>ALIENTO</Text><Text style={s.brandLine}>A clearer path to care.</Text></View></View><Pressable onPress={onProfile} style={s.profileIcon}><Text style={{ fontSize: 20, color: C.inkSoft }}>◉</Text></Pressable></View>;
}
export function Heading({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return <View style={s.headingWrap}>{eyebrow ? <Text style={s.eyebrow}>{eyebrow}</Text> : null}<Text style={s.heading}>{title}</Text>{body ? <Text style={s.subtitle}>{body}</Text> : null}</View>;
}
export function BottomNav({ selected, onSelect }: { selected: TabKey; onSelect: (x: TabKey) => void }) {
  const items: { key: TabKey; label: string; glyph: string }[] = [
    { key: "home", label: "Home", glyph: "⌂" }, { key: "care", label: "My care", glyph: "♡" },
    { key: "orders", label: "Orders", glyph: "▤" }, { key: "you", label: "You", glyph: "◉" },
  ];
  return <View style={s.nav}>{items.map(it => <Pressable key={it.key} onPress={() => onSelect(it.key)} style={s.navItem}><Text style={[s.navGlyph, selected === it.key && { color: C.mint }]}>{it.glyph}</Text><Text style={[s.navLabel, selected === it.key && { color: C.mint }]}>{it.label}</Text></Pressable>)}</View>;
}
export function Divider() { return <View style={s.divider} />; }
export function Status({ title, body, done = false }: { title: string; body: string; done?: boolean }) {
  return <View style={s.statusRow}><View style={[s.statusDot, done && { backgroundColor: C.mint }]} /><View style={{ flex: 1 }}><Text style={s.statusTitle}>{title}</Text><Text style={s.statusBody}>{body}</Text></View></View>;
}
