import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
function NavIcon({ type, active }: { type: TabKey; active: boolean }) {
  const color = active ? C.ink : C.white;
  if (type === "orders") return <View style={{ height: 18, width: 17, borderWidth: 1.8, borderColor: color, borderRadius: 2, marginTop: 3 }}>
    <View style={{ position: "absolute", top: -6, left: 4, width: 6, height: 7, borderWidth: 1.8, borderBottomWidth: 0, borderColor: color, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
  </View>;
  if (type === "care") return <View style={{ width: 19, height: 16, borderWidth: 1.8, borderColor: color, borderRadius: 2, marginTop: 2 }}>
    <View style={{ width: 6, height: 6, borderLeftWidth: 1.8, borderColor: color, transform: [{ rotate: "-35deg" }], position: "absolute", bottom: -6, left: 3 }} />
  </View>;
  if (type === "you") return <View style={{ alignItems: "center", justifyContent: "center", height: 22, width: 22 }}>
    <View style={{ width: 8, height: 8, borderRadius: 5, borderWidth: 1.8, borderColor: color, marginBottom: 2 }} />
    <View style={{ width: 17, height: 8, borderWidth: 1.8, borderBottomWidth: 0, borderColor: color, borderTopLeftRadius: 9, borderTopRightRadius: 9 }} />
  </View>;
  return <View style={{ alignItems: "center", justifyContent: "flex-end", height: 22, width: 22 }}>
    <View style={{ width: 14, height: 13, borderWidth: 1.8, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
      <View style={{ position: "absolute", left: 4, bottom: 0, width: 5, height: 7, borderWidth: 1.4, borderBottomWidth: 0, borderColor: color }} />
    </View>
    <View style={{ position: "absolute", top: 2, width: 15, height: 15, borderTopWidth: 1.8, borderLeftWidth: 1.8, borderColor: color, transform: [{ rotate: "45deg" }] }} />
  </View>;
}
export function BottomNav({ selected, onSelect }: { selected: TabKey; onSelect: (x: TabKey) => void }) {
  const items: { key: TabKey; label: string }[] = [
    { key: "home", label: "Home" }, { key: "care", label: "Care" },
    { key: "orders", label: "Orders" }, { key: "you", label: "You" },
  ];
  return <View style={{ marginHorizontal: 24, marginBottom: 24, marginTop: 8, height: 78, backgroundColor: C.ink,
    borderRadius: 26, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 9 }}>
    {items.map(it => {
      const active = selected === it.key;
      return <Pressable key={it.key} accessibilityRole="button" accessibilityLabel={it.label}
        accessibilityState={{ selected: active }} onPress={() => onSelect(it.key)}
        style={{ width: 68, height: 60, borderRadius: 20, backgroundColor: active ? C.mint : "transparent",
          alignItems: "center", justifyContent: "center", gap: 6 }}>
        <NavIcon type={it.key} active={active} />
        <Text style={{ color: active ? C.ink : C.white, fontFamily: Platform.OS === "web" ? "Manrope" : undefined,
          fontWeight: "600", fontSize: 11, lineHeight: 14 }}>{it.label}</Text>
      </Pressable>;
    })}
  </View>;
}
export function Divider() { return <View style={s.divider} />; }
export function Status({ title, body, done = false }: { title: string; body: string; done?: boolean }) {
  return <View style={s.statusRow}><View style={[s.statusDot, done && { backgroundColor: C.mint }]} /><View style={{ flex: 1 }}><Text style={s.statusTitle}>{title}</Text><Text style={s.statusBody}>{body}</Text></View></View>;
}
