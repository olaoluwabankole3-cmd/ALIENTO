import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import type { Answer, Spot } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function DropzoneScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
  return shell("Preferred handoff spot", <><Heading eyebrow="CAMERA & DROP-ZONE · CONCEPT" title="Choose a preferred meeting spot." body="The camera view is not connected. There is no real-time camera, drone command or descent control." /><View style={s.cameraMock}><View style={s.cameraCornerTL} /><View style={s.cameraCornerTR} /><View style={s.cameraCornerBL} /><View style={s.cameraCornerBR} /><Text style={{ fontSize: 38, color: C.mint }}>⌖</Text><Text style={{ color: C.white, fontWeight: "800", marginTop: 12 }}>SIMULATED CAMERA VIEW</Text><Text style={{ color: "#A7C5BB", marginTop: 6 }}>No live feed</Text></View><Card><Text style={s.cardTitle}>Preferred spot</Text><View style={s.chipWrap}>{(["Front entrance", "Gate", "Open courtyard"] as Spot[]).map(x => <Choice key={x} label={x} selected={d.spot === x} onPress={() => patch({ spot: x })} />)}</View></Card><Note title="Preference only — not a flight command" body="A qualified operator and independent safety system must approve any aircraft movement. The selected point cannot trigger a flight or descent." tone="danger" /><Btn title="Save preference" onPress={() => go("mycare")} /><Btn title="Cancel" variant="outline" onPress={back} /></>);
}
