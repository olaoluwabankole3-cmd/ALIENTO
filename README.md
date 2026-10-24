# ALIENTO

**A clearer path to care.**

ALIENTO is a voice-first healthcare coordination platform being designed for Android first. It aims to connect patients with qualified clinical care and licensed pharmacy workflows, with autonomous home medicine delivery as a future research and engineering milestone.

## Product principles

- Voice and text intake should let people explain how they feel in their own words.
- AI may structure patient-reported information, ask bounded follow-up questions, translate or simplify language, and prepare a clinician-facing brief.
- AI must not independently diagnose, prescribe, or make consequential treatment decisions.
- Qualified clinicians remain responsible for clinical assessment and treatment decisions.
- Prescription fulfilment must follow applicable clinical and pharmacy requirements.
- Health information requires appropriate consent, access control, minimisation, and auditability.
- Emergency warnings must direct people toward urgent professional help rather than treating the app as an emergency service.
- Drone delivery is a planned concept. No real aircraft, flight-control system, camera feed, prescription service, or delivery partner is connected to this project yet. Prototype states must be visibly labelled as simulated.

## Current stage

**Phase 1 — Product definition and design.** The patient experience is being designed in Figma before application implementation. The working Figma file is [ALIENTO — Android Patient](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2).

The current design direction uses deep teal, emerald and mint, Manrope typography, and a glossy sculptural 3D ALIENTO mark. Design assets and workflows are still being refined; the Figma file is the source of truth for screen layouts.

## Planned implementation direction

- Android first; iOS can follow after the initial product is validated.
- Proposed app framework: React Native + Expo + TypeScript.
- Backend, authentication, data model, AI providers, payments, and integrations must be confirmed before production implementation.
- Secrets must remain server-side. The mobile app must not contain provider API keys.
- Clinical, pharmacy, privacy, payment, and aviation workflows require qualified review and applicable approvals before launch.

## Initial patient journey

1. Welcome and home
2. Voice or text intake
3. Adaptive follow-up questions
4. Review the structured health brief
5. Verify account and obtain consent before saving/sharing the clinical record
6. Clinician review and, where appropriate, consultation
7. Clinician-approved prescription and licensed-pharmacy workflow
8. Order confirmation and transparent price
9. Future delivery tracking and controlled pod/drop-zone concept
10. Post-care follow-up and patient health history

Not every patient needs every step. A patient may need clinical assessment without medication or may need urgent in-person care.

## Status

This repository is being initialized with product documentation. It does not yet contain the application code. Implementation begins after the core design and user journeys have been reviewed.
