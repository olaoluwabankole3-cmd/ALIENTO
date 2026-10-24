# ALIENTO — Implementation Plan

**Platform:** Android first, iOS later  
**App framework:** React Native + Expo + TypeScript  
**Implementation branch:** `feat/android-patient-app-20261024`  
**Current milestone:** Initial UI prototype and app configuration committed; validation pending

## Gate 0 — Design agreement

- [x] User approved the current visual direction and patient screen designs.
- [x] Core journeys and safety requirements documented.
- [x] Initial native-screen implementation created in `App.tsx`.
- [ ] Review visual fidelity against the full 14-screen Figma file.
- [ ] QA every route, back action, tab, field validation, accessibility and screen size.
- [ ] Replace the in-code logo approximation with the approved production-resolution logo asset.

**Design source:** [ALIENTO — Android Patient in Figma](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2)

## Gate 1 — Mobile app foundation

Committed so far:
- Expo app manifest and package scripts
- TypeScript configuration
- Initial theme, reusable UI helpers and patient journeys, currently in a single `App.tsx`
- Demo-only flag values in `app.json`
- Local in-memory sample data with explicit service limitations

Next:
- Install dependencies and run `npm run typecheck` and `npm run doctor`
- Verify the app on an Android device/emulator
- Split the app into reusable files and add focused tests where useful
- Add the approved 3D logo as a local asset and ensure it is correctly sized
- Check navigation, keyboard behaviour, screen reader labels, contrast and responsive layouts

The implementation environment did not have dependable package-registry access, so successful dependency installation or an Android build has **not** been verified yet.

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
- [ ] Device testing, interaction QA, visual comparison and accessibility checks

All screens above are prototype UI only. A button or status screen does not mean a service is connected.

## Gate 3 — Product backend and identity

Not started. Decide the backend, authentication, identity verification and data architecture only after requirements and partner constraints are reviewed.

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
