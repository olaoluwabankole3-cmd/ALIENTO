# ALIENTO

**A clearer path to care.**

ALIENTO is an Android-first, voice-first healthcare coordination app prototype. It helps people describe what they are experiencing, organise a patient-reported health brief and understand how a qualified professional could review their request.

## Current build status

The `feat/android-patient-app-20261024` branch contains the initial React Native + Expo + TypeScript UI prototype. The application uses local in-memory state and sample information only.

- Patient flow: welcome, home, text intake, follow-up questions, editable health brief and consent.
- Care coordination: simulated review status, consultation/care-plan concept and pharmacy/order previews.
- Personal space: My Care and profile/preferences.
- Safety: urgent-care guidance and clear notices about unconnected services.
- Future concepts: delivery tracking and preferred handoff spot screens, explicitly marked as simulated.

The design source is [ALIENTO — Android Patient in Figma](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2).

## Run locally

Use Node.js 22.13 or newer and npm. This branch includes a lockfile; use `npm ci` to install the exact dependency tree.

```bash
npm ci
npm run typecheck
npm run doctor
npx expo start
```

Scan the QR code with an Expo Go installation compatible with this project's Expo SDK 57. The latest Play Store Expo Go may target a newer SDK; when versions differ, use the official compatible Expo Go release or set up a development build rather than changing dependencies ad hoc. Alternatively, run `npm run android` with an Android emulator and Android development tools configured.

Useful commands:

- `npm run start` — start the Expo development server
- `npm run android` — open in an Android emulator
- `npm run typecheck` — run TypeScript checks
- `npm run doctor` — inspect common Expo project setup issues

## Safety and privacy boundaries

This is a **prototype, not a production healthcare service**. Do not enter real patient information.

The app currently has no backend, real account registration, phone/OTP verification, speech-to-text, AI provider, clinician inbox, clinical decision-making, prescription service, pharmacy inventory, payment processing, live camera, drone, GPS or delivery integration. Form state is local to the running app and is not a secure medical record. Review and consent screens are illustrative and do not constitute legal consent capture.

AI in the intended product may organise patient-reported information, ask bounded follow-up questions and prepare a clinician-facing brief. It must not independently diagnose, prescribe or make consequential treatment decisions. Only an appropriately qualified clinician can make clinical decisions. Medicine fulfilment must require a valid prescription and licensed-pharmacy workflow where applicable.

Drone delivery and camera/drop-zone screens are visual concepts only. A patient-selected spot is a preference, never a flight-control command.

## Project documents

- [Product specification](docs/PRODUCT_SPEC.md)
- [Android design specification](docs/ANDROID_DESIGN_SPEC.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Prototype limitations](docs/PROTOTYPE_LIMITATIONS.md)

## Before any pilot

Complete the remaining visual, accessibility and error-state QA, then the required backend, authentication, consent, authorisation, auditability, clinical and pharmacy workflows, security/privacy reviews and applicable approvals. A prototype smoke test or passing CI checks do not establish that the service is ready for real users or patient data.
