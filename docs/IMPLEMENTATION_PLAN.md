# ALIENTO — Implementation Plan

**Platform:** Android first, iOS later  
**App framework:** React Native + Expo + TypeScript  
**Implementation branch:** `feat/android-patient-app-20261024`  
**Current milestone:** Interactive prototype running on the user's Android phone; the first manual core-journey smoke test has been reported complete.

## Gate 0 — Design agreement and first device pass

- [x] User approved the current visual direction and patient screen designs.
- [x] Core journeys and safety requirements documented.
- [x] Initial native-screen implementation created in `App.tsx`.
- [x] Approved 3D logo included as a local asset.
- [x] User launched the app on an Android phone using an Expo Go version compatible with SDK 57.
- [x] User reports completing the core journey smoke-test checklist, including navigation, text editing, urgent guidance, consent screens, care-plan/order previews, profile screens, keyboard behaviour and checking for stuck buttons.
- [ ] Review visual fidelity against the full 14-screen Figma file.
- [ ] Complete a separate accessibility, contrast, small-screen and screen-reader review.
- [ ] Test additional error, empty and interrupted states systematically.

**Design source:** [ALIENTO — Android Patient in Figma](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2)

## Gate 1 — Mobile app foundation

Confirmed so far:
- Expo app manifest, package scripts and TypeScript configuration
- Approved 3D logo at `assets/aliento-mark.jpg`
- Committed `package-lock.json` for repeatable dependency installation
- Clean `npm ci`, TypeScript check, Android JavaScript export and Expo diagnostics passed in GitHub Actions
- App started on a real Android phone in Expo Go compatible with the project's SDK 57
- Demo-only flags and local in-memory sample data with explicit service limitations

Next:
- Refactor the large `App.tsx` into clear screen, component, navigation and theme modules without changing the approved UI.
- Add focused tests for critical navigation and safety-related UI branches.
- Review accessibility labels, contrast, keyboard behaviour and responsive layouts.
- Continue the separate visual comparison against all 14 Figma frames.

A standalone Android APK/release build, production backend, security assessment and comprehensive accessibility review have **not** been completed. The passing CI checks are not a substitute for these tasks.

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
- [x] First user-reported Android device smoke test of the core journeys, navigation and keyboard/button behaviour
- [ ] Detailed visual comparison, accessibility review and additional systematic error/empty-state testing

All screens above are prototype UI only. A button or status screen does not mean a service is connected.

## Gate 3 — Product backend and identity

Not started. Define requirements and partner constraints before selecting and implementing the backend, authentication, identity verification and data architecture.

Required before real patient records are created or shared:
- Authentication and verifiable account lifecycle
- Consent receipt/versioning, withdrawal handling and a defined retention/deletion process
- Per-patient and role-based authorisation enforced server-side
- Auditable access to sensitive records and consequential actions
- Secure storage, minimal collection, backups and incident-response procedures
- Automated authorisation tests proving cross-patient access is blocked

No provider API key or privileged secret should be bundled into the mobile app.

## Gate 4 — Governed AI and clinical workflow

Not started. AI may organise patient-reported information, ask bounded follow-up questions, translate/simplify language and prepare a clinician-facing brief. It must not independently diagnose, prescribe or make consequential treatment decisions.

A qualified clinician must own assessment and care decisions. Emergency warnings must not be presented as a diagnosis or a substitute for urgent in-person care. Appointment requests remain pending until a provider confirms them.

## Gate 5 — Licensed pharmacy, payment and fulfilment

Not started. Real fulfilment requires the applicable prescription validation and licensed-pharmacy workflow, availability and final price confirmation, order-state handling, payment reconciliation and exception/refund processes. Patients must not be pressured into buying medicine.

## Gate 6 — Future delivery research

The delivery tracking and camera/drop-zone screens remain simulated concepts. No aircraft, live camera, GPS or operator is connected. Any real drone work is a separate future engineering and approval workstream. A patient-selected location is a preferred target, not a flight or descent command; independent operator and safety controls must decide whether delivery can proceed.

## Gate 7 — Pilot and launch readiness

No production pilot is authorised by this prototype. Before a pilot: complete product and accessibility QA, qualified clinical/pharmacy review, data-protection/security assessment, support/incident procedures, integrations testing and required local approvals. Use a limited controlled pilot only after the real workflow is validated.
