import React, { useState } from "react";
import { Text, View } from "react-native";
import s from "../theme/styles";
import { Btn, Card, Divider, Field, Heading, Note } from "../components/ui";
import type { ScreenProps } from "./types";

export function SummaryScreen({ d, patch, go, shell }: ScreenProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const saveConcern = () => {
    if (!draft?.trim()) return;
    patch({ symptoms: draft.trim() });
    setDraft(null);
  };

  return shell("Your health brief", <>
    <Heading eyebrow="STEP 3 OF 4" title="Review your words" body="Read through your brief. You can change your concern here before moving on." />
    <Card>
      <Text style={s.fieldLabel}>YOUR MAIN CONCERN</Text>
      {draft === null ? <>
        <Text style={s.summaryText}>{d.symptoms.trim() || "No concern entered yet."}</Text>
        <Btn title={d.symptoms.trim() ? "Edit concern" : "Add a concern"} variant="secondary" onPress={() => setDraft(d.symptoms)} />
      </> : <>
        <Field label="Edit your main concern" value={draft} onChange={setDraft} multiline />
        <Btn title="Save changes" onPress={saveConcern} disabled={!draft.trim()} />
        <Btn title="Cancel edit" variant="secondary" onPress={() => setDraft(null)} />
      </>}
      <Divider />
      <View style={s.twoCol}>
        <View style={{ flex: 1 }}><Text style={s.fieldLabel}>DURATION</Text><Text style={s.summaryValue}>{d.duration}</Text></View>
        <View style={{ flex: 1 }}><Text style={s.fieldLabel}>VOMITING</Text><Text style={s.summaryValue}>{d.vomiting}</Text></View>
      </View>
    </Card>
    <Field label="Anything else? (optional)" value={d.notes} onChange={notes => patch({ notes })}
      placeholder="Add a detail you want included…" multiline />
    <Note title="Nothing has been shared" body="This brief contains your own words. In this preview, no clinician receives it." />
    <Btn title="Continue to consent  →" onPress={() => go("consent")} disabled={draft !== null || !d.symptoms.trim()} />
  </>);
}
