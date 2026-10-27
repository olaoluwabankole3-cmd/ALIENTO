import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import type { Answer, Spot } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function OrderScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Order review", <><Heading eyebrow="FULFILMENT · CONCEPT" title="Review everything before confirming." body="A real order would show a verified pharmacy, final item price, delivery fee, availability and cancellation terms." /><Card><Text style={s.cardTitle}>Order summary</Text><Status title="Pharmacy" body="Placeholder — no partner connected" /><Status title="Medicine and price" body="Not quoted; no charge will be taken" /><Status title="Delivery address" body={d.address || "Not added"} /><Divider /><Field label="Home or delivery address (sample only)" value={d.address} onChange={v => patch({ address: v })} placeholder="Enter a non-sensitive test address" /><Text style={s.fieldLabel}>PREFERRED HANDOFF SPOT</Text><View style={s.chipWrap}>{(["Front entrance", "Gate", "Open courtyard"] as Spot[]).map(x => <Choice key={x} label={x} selected={d.spot === x} onPress={() => patch({ spot: x })} />)}</View></Card><Note title="No checkout or payment" body="This is a UI preview. No order has been placed and no money will be collected." tone="violet" /><Btn title="Preview future delivery concept" onPress={() => go("delivery")} /><Btn title="Save preference and leave" variant="outline" onPress={() => go("mycare")} /></>);
}
