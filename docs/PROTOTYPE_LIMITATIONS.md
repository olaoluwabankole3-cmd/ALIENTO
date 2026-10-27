# ALIENTO Prototype Limitations

This document lists what is simulated in the current Android-first UI prototype and what must not be inferred from it.

## What works locally

- Navigation between the implemented screens
- Local editing of sample symptom text, duration, follow-up answers, profile fields and an example address
- Local consent-checkbox state for demonstrating the flow
- Branching to prominent urgent guidance when a severe-symptom answer is selected
- A no-medicine path from the care-plan concept
- Preview screens for pharmacy fulfilment, order review, delivery progress and a preferred handoff location

State exists only in the running app. It is not durable storage, a secure health record or a legal consent receipt.

## Not connected

- User registration, login, phone or identity verification
- Cloud database, secure patient records, authorisation, audit logs or retention/deletion controls
- Microphone recording, speech-to-text, text-to-speech or real language translation
- An AI model or clinical decision-support service
- A licensed clinician, clinical inbox, consultations or confirmed appointments
- Prescription validation, licensed pharmacy, inventory, stock, pricing or dispensing
- Payment, refunds or order processing
- Real map routing, GPS, drone, flight controller, delivery pod or delivery operator
- Live camera or video stream, remote capture, geofencing or any flight/descent control
- Production notifications or emergency-service integration

## Clinical safety boundaries

- The example health brief reflects user-entered text. It is not a diagnosis.
- The simulated care plan and medication workflow are examples of interface states, not medical advice or a prescription.
- Do not use this prototype to decide whether symptoms are safe, to delay urgent care or to select a medicine.
- A qualified clinician must make clinical decisions. Pharmacy fulfilment, where applicable, requires a valid prescription and an appropriate licensed-pharmacy process.
- The emergency screen is general signposting, not an emergency assessment tool.

## Privacy boundaries

Do not enter real patient information or use this app to coordinate real care. The current consent UI is illustrative and does not securely store consent, authenticate a user or share records.

Any production version requires explicit consent capture, server-enforced least-privilege access, patient-to-record authorisation tests, sensitive-access audit events, secure storage, a data retention/deletion process and an incident-response plan.

## Delivery concept boundaries

The map, delivery progress and camera-style display are decorative simulations. The preferred drop-zone selection records a local UI preference only. It cannot send a command to an aircraft. A real operator and independent safety system must evaluate any delivery location and can reject it.

## Verification status

- The user launched the original app on an Android phone using an Expo Go version compatible with SDK 57 and reports completing the first manual smoke test of the main patient journeys, navigation, keyboard behaviour and buttons.
- The latest modular refactor passed GitHub Actions checks for clean locked installation, TypeScript, urgent/navigation/consent decision tests, Android JavaScript export and Expo diagnostics.
- The refactored branch still needs to be reopened on the Android device and manually smoke-tested before the refactor is described as confirmed on-device.
- The app has not been through a comprehensive visual-regression or accessibility audit.
- A standalone Android release build, production backend, security assessment, real clinical/pharmacy testing and launch readiness have not been established by these checks.

Treat this as a demo prototype only. Do not enter real patient information or use it to coordinate real care.
