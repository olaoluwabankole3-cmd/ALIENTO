# ALIENTO — Implementation Plan

**Platform:** Android first, iOS later  
**App framework:** React Native + Expo + TypeScript  
**Implementation branch:** `feat/android-patient-app-20261024`  
**Current milestone:** Modular Android prototype; the original UI passed the user's first device smoke test, and the refactor has passed automated checks. Device re-test after the refactor is next.

## Gate 0 — Design agreement and first device pass

- [x] User approved the current visual direction and patient screen designs.
- [x] Core journeys and safety requirements documented.
- [x] Approved 3D logo included as a local asset.
- [x] User launched the original prototype on an Android phone using an Expo Go version compatible with SDK 57.
- [x] User reports completing the core journey smoke-test checklist on that build, including navigation, text editing, urgent guidance, consent screens, care-plan/order previews, profile screens, keyboard behaviour and checking for stuck buttons.
- [x] The existing screen markup and shared styles have been moved into separate modules on the feature branch without intentional visual redesign.
- [ ] Re-open the refactored branch on the Android device and repeat the same journey checklist.
- [ ] Review visual fidelity against the full 14-screen Figma file.
- [ ] Complete a separate accessibility, contrast, small-screen and screen-reader review.
- [ ] Test additional error, empty and interrupted states systematically.

**Design source:** [ALIENTO — Android Patient in Figma](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2)

## Gate 1 — Mobile app foundation

The app is now organised into:
- `src/screens/` — 15 screen files for the patient journeys
- `src/components/ui.tsx` — shared buttons, cards, tags, notes, fields, navigation elements and other reusable UI
- `src/theme/tokens.ts` and `src/theme/styles.ts` — shared colours and style definitions
- `src/domain/patient.ts` — page/data types and illustrative demo state
- `src/navigation/routes.mjs` and its TypeScript declaration — testable urgent-guidance, follow-up, tab-navigation and consent decisions
- `App.tsx` — central navigation state and screen composition
- `tests/decisions.test.mjs` — automated checks for urgent-routing, tab destinations and consent gating

GitHub Actions has passed for the latest code refactor:
- Clean locked dependency installation (`npm ci`)
- TypeScript check
- Focused navigation and safety decision tests
- Android JavaScript export
- Expo project diagnostics

The passing checks verify code and bundle consistency, but they do not replace a device re-test, visual comparison, accessibility audit or release build.

Next:
- Verify the refactored code on the same Android device.
- Preserve the approved design while comparing all 14 Figma screens.
- Expand tests around navigation history and error/empty states.
- Review accessibility labels, contrast, keyboard behaviour and responsive layouts.

A standalone Android release build, production backend, security assessment and comprehensive accessibility review have **not** been completed.

## Gate 2 — Patient experience with demo data

- [x] Welcome and home
- [x] Text intake screen with editable sample transcript
- [x] Follow-up questions and safety-warning path
- [x] Editable patient-reported health brief
- [x] Account details and explicit consent UI
- [x] Simulated clinical-review state
- [x] Consultation/care-plan concept with no-medicine route
- [x] Prescription/pharmacy concept and order review
- [x] Simulated delivery tracking and preferred handoff spot concept
- [x] My Care and profile/preferences
- [x] First user-reported Android device smoke test of the original prototype's core patient journeys, navigation and keyboard/button behaviour
- [ ] Repeat the device smoke test against the refactored build
- [ ] Detailed visual comparison, accessibility review and systematic error/empty-state testing

All screens above are prototype UI only. A button or status screen does not mean a service is connected.

## Gate 3 — Product backend and identity

**Current status:** Architecture proposal documented; no ALIENTO Supabase project or live backend has been created or connected.

- [x] Propose Supabase Postgres/Auth/Edge Functions as the backend candidate.
- [x] Document data entities, role/access expectations, consent-first submission and security boundary.
- [ ] Choose the exact project region after verifying current region availability, data-transfer implications and project cost.
- [ ] Confirm the initial Auth method and pilot partner assumptions.
- [ ] Establish Supabase CLI/local development and generate versioned migrations.
- [ ] Implement RLS and test patient-to-patient and assigned/unassigned-clinician isolation.
- [ ] Connect identity and the first consent-and-submit workflow.
- [ ] Complete privacy/legal review and a DPIA where required before processing real health data.

See [Backend Architecture Proposal](BACKEND_ARCHITECTURE.md). Do not use another project's database and do not enter real patient information in the demo.

## Gate 4 — Governed AI and clinical workflow

Not started. AI may organise patient-reported information, ask bounded follow-up questions, translate/simplify language and prepare a clinician-facing brief. It must not independently diagnose, prescribe or make consequential treatment decisions.

A qualified clinician must own assessment and care decisions. Emergency warnings must not be presented as a diagnosis or a substitute for urgent in-person care. Appointment requests remain pending until a provider confirms them.

## Gate 5 — Licensed pharmacy, payment and fulfilment

Not started. Real fulfilment requires the applicable prescription validation and licensed-pharmacy workflow, availability and final price confirmation, order-state handling, payment reconciliation and exception/refund processes. Patients must not be pressured into buying medicine.

## Gate 6 — Future delivery research

The delivery tracking and camera/drop-zone screens remain simulated concepts. No aircraft, live camera, GPS or operator is connected. Any real drone work is a separate future engineering and approval workstream. A patient-selected location is a preferred target, not a flight or descent command; independent operator and safety controls must decide whether delivery can proceed.

## Gate 7 — Pilot and launch readiness

No production pilot is authorised by this prototype. Before a pilot: complete product and accessibility QA, qualified clinical/pharmacy review, data-protection/security assessment, support/incident procedures, integrations testing and required local approvals. Use a limited controlled pilot only after the real workflow is validated.
