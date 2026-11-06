import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function DeliveryScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Delivery tracking", <><View style={s.deliveryHeader}><Tag tone="dark">FUTURE CONCEPT</Tag><Text style={s.deliveryTitle}>Your delivery, made clearer.</Text><Text style={s.deliveryBody}>The map and progress below are illustrative only. No drone or delivery operator is connected.</Text><View style={s.routeMap}><View style={s.mapGrid} /><View style={s.mapPath} /><View style={s.mapPinOne}><Text>•</Text></View><View style={s.mapPinTwo}><Text>⌂</Text></View><Text style={s.mapLabel}>ILLUSTRATIVE ROUTE</Text></View></View><Card><Status title="Order accepted" body="Simulated" done /><Status title="Preparing for dispatch" body="Simulated" /><Status title="In transit" body="No drone or GPS feed" /><Status title="Handover" body="No delivery scheduled" /></Card><Note title="No aircraft is connected" body="A real delivery requires an authorised operator, safety checks and independent flight control. Your selected spot is only a preference." /><Btn title="Preview handoff spot selection" onPress={() => go("dropzone")} /><Btn title="Return to my care" variant="outline" onPress={() => go("mycare")} /></>);
}
