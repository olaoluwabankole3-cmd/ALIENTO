# ALIENTO Figma Flow Parity — Intake to Consent

Approved Figma source: https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2

Mapped screens:
- Home: `9:21` (previously implemented)
- Voice intake: `9:80`
- Follow-up: `9:125`
- Health summary: `9:166`
- Consent: `22:2`

The common React Native / Expo flow frame preserves the original 412 px Figma proportions on the web, Manrope text, back navigation, colors, pills, and spacing. The microphone, three concentric rings, back arrow, pulse, and shield are local PNG assets directly exported from the corresponding Figma nodes (not temporary remote asset links).

**Deliberate safety and functional departures from the static mockups:**
- Voice intake is a demonstration with an editable fictional transcript and a sample waveform. It never accesses the microphone, records audio or performs transcription. The UI visibly says so.
- The follow-up questions stay editable. The duration prompt is generic (the app must not assume fever); the safety question allows No/Yes/Not sure, and Yes/Not sure leads to urgent guidance.
- Health summary uses the patient's editable words and answers, never asserts a diagnosis, AI triage, or real clinician review, and supports optional notes.
- Consent is explicitly local demo state with distinct save/share/AI acknowledgements. No real account is verified, no message is sent, and no production privacy notice is claimed.

**Next implementation:** authenticated clinician inbox, administrator-controlled assignment, response workflow, notifications and protected return journey; security review of privileged functions and private tables remains a production gate.

`Expo web design checks`, mobile checks and the Android tester workflow should run on the same development branch; deploy to a protected Vercel preview after passing.
