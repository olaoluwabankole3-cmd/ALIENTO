import React from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";
import { C } from "../theme/tokens";
import s from "../theme/styles";
import { BrandHeader, Btn, Card, Check, Choice, Divider, Field, Heading, Logo, Note, Status, Tag } from "../components/ui";
import { initial, urgentCopy } from "../domain/patient";
import { getFollowUpDestination, isConsentReady, isUrgentAnswer } from "../navigation/routes.mjs";
import type { ScreenProps } from "./types";

export function SummaryScreen(props: ScreenProps) {
  const { d, patch, go, back, nav, shell, voicePreviewActive, setVoicePreviewActive } = props;
const startConsent = () => go("consent");
  return shell("Your health brief", <><Heading eyebrow="STEP 3 OF 4" title="Does this reflect what you meant?" body="Check the details. You can correct anything before continuing." /><Note title="AI-assisted organisation only" body="This is patient-reported information, not a diagnosis or treatment recommendation." tone="violet" /><Card><View style={s.inlineBetween}><Text style={s.cardTitle}>Health brief</Text><Tag>PATIENT-REPORTED</Tag></View><Text style={s.fieldLabel}>WHAT YOU SHARED</Text><Text style={s.summaryText}>{d.symptoms.trim() || "No symptom details entered."}</Text><Divider /><View style={s.twoCol}><View style={{ flex: 1 }}><Text style={s.fieldLabel}>DURATION</Text><Text style={s.summaryValue}>{d.duration}</Text></View><View style={{ flex: 1 }}><Text style={s.fieldLabel}>VOMITING</Text><Text style={s.summaryValue}>{d.vomiting}</Text></View></View>{d.notes.trim() ? <><Divider /><Text style={s.cardBody}>{d.notes}</Text></> : null}</Card><Field label="Corrections or extra context (optional)" value={d.notes} onChange={v => patch({ notes: v })} placeholder="Add anything you want to clarify…" multiline /><Note title="Nothing has been shared" body="The next step is verification and explicit consent. No health record is created or sent in this prototype." /><Btn title="Continue to consent  →" onPress={startConsent} /></>);
}
