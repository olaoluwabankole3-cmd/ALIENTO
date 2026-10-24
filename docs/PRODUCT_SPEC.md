# ALIENTO — Product Specification (working draft)

**Status:** Phase 1 — product definition and design  
**Market starting point:** Nigeria  
**Primary platform:** Android mobile app  
**Working tagline:** A clearer path to care.

This document records the current product direction. It is a working specification, not a claim of clinical validation, regulatory approval, or production readiness.

## 1. Product intent

ALIENTO is a voice-first healthcare coordination platform. It aims to help a patient explain what they are experiencing, organise that information for a qualified professional, coordinate appropriate care, and—when a valid prescription is issued—coordinate medicine fulfilment through a licensed pharmacy.

Longer term, ALIENTO aims to support autonomous home delivery through a purpose-built drone and secure delivery pod. The drone is a future engineering milestone, not an existing operational capability.

## 2. Core principles

1. **Human clinical accountability.** AI supports information gathering and coordination. It does not independently diagnose, prescribe, or decide consequential treatment.
2. **Safety before fulfilment.** Potential emergencies must be routed toward urgent medical assessment. They must not continue through an ordinary medicine-order journey by default.
3. **Consent and minimisation.** A patient can explore a limited initial experience. An account, identity verification, and explicit permission are required before creating/sharing a clinical record or requesting clinical services.
4. **Least-privilege access.** Patients see their own records. Clinicians see only the cases assigned or otherwise authorised to them. Pharmacy users receive only the valid prescription/order details needed to fulfil an order. Operational access is restricted and audited.
5. **Transparent state.** Patients should understand whether a case is being prepared, awaiting clinical review, awaiting their response, or ready for the next step. A requested appointment is not shown as confirmed until the provider confirms it.
6. **No forced medicine purchase.** Some care journeys do not require medicine or may require in-person assessment.
7. **Honest simulation.** Demonstration data, AI outputs, pharmacy stock and drone activity must be clearly identified as simulated until connected to validated production systems.

## 3. People and workspaces

### Patient
- Welcome, language choice and accessible onboarding
- Voice or text symptom intake
- Review and correct a structured health brief
- Consent and account verification
- Track clinical review and consultation requests
- See clinician-approved instructions and prescriptions
- Review pharmacy details, stock/price confirmation and total cost
- Review orders and delivery status
- Manage appointments, health briefs, follow-up and privacy preferences

### Clinician
- Review assigned cases and patient-reported summaries
- Inspect the original patient statements and relevant context
- Request clarifying information or arrange a consultation
- Document clinical assessment and the resulting care plan
- Issue a prescription only when clinically appropriate and through the authorised workflow
- Set follow-up requirements

### Pharmacy
- Verify pharmacy access and authorisation
- Validate prescription and dispensing requirements
- Confirm availability, price and fulfilment readiness
- Prepare a secure package and associate it with the correct order
- Report exceptions, substitution needs or unavailable stock using the permitted workflow

### Care operations
- Manage partner onboarding, roles and access
- Coordinate operational exceptions and support
- Monitor order states and audit events
- Reconcile payments and refunds when payment integration is approved
- Review access records and investigate incidents

### Future delivery operator
- Receive eligible mission requests through a documented integration
- Evaluate airspace, location, weather, aircraft, payload and operating constraints under its approved procedures
- Provide mission status and delivery confirmation
- Own safety-critical flight operations and aircraft control

## 4. Patient journey

1. **Welcome.** The patient sees the ALIENTO promise, language choice and voice-first entry.
2. **Initial intake.** The patient describes symptoms in their own words. Voice and text are both supported. English and Nigerian Pidgin are candidate launch languages.
3. **Clarify.** The system asks bounded, relevant follow-up questions. The patient can correct the transcript and answers.
4. **Safety screen.** Rules identify reported warning signs and direct the patient to urgent professional help when appropriate. This is not a diagnosis.
5. **Health brief.** ALIENTO presents a structured, editable summary of what the patient said, what remains uncertain and the stated duration. It must distinguish patient-reported information from inference.
6. **Account and consent.** Before saving or sharing the brief for clinical services, the patient verifies their account and explicitly agrees to the applicable data use and clinical handoff.
7. **Clinical review.** The case enters an authorised clinician's queue. The patient sees a pending state until an actual decision is recorded.
8. **Consultation/care plan.** The clinician may request more information, arrange a consultation, recommend in-person care, issue a prescription where clinically appropriate, or determine that medication is not needed.
9. **Pharmacy.** A valid prescription may be sent to a participating licensed pharmacy. Stock and final price must be confirmed.
10. **Order review.** The patient checks the order, destination and total amount before payment/confirmation.
11. **Delivery.** A real delivery provider, if available and authorised for the location, fulfils the order. Drone tracking and camera/drop-zone selection are future capabilities.
12. **Follow-up.** The patient can access clinician instructions and any recommended follow-up. Worsening symptoms or red flags should not be handled solely through automated follow-up.

Not every patient takes every step. The product should support no-prescription outcomes and urgent referral without pressure to order medicine.

## 5. Clinical record and consent rules

Before a clinical brief is stored as a record or shared for a service request:
- show the patient what information will be kept and why;
- require the required account verification and explicit sharing consent;
- record when the consent was given and the applicable consent text/version;
- allow the patient to correct the summary before sharing;
- ensure revocation and account/record requests are handled by a defined process consistent with applicable requirements;
- log sensitive access and important record changes.

Required consent must not be bundled into marketing permission. Marketing opt-in, if added later, must be separate and optional.

## 6. Important states and exceptions

- **Potential emergency:** prominent urgent-care guidance; do not lead with pharmacy fulfilment.
- **Voice permission denied or transcription failure:** provide text entry, retry and correction options.
- **Uncertain or contradictory information:** ask a clarifying question or mark the field as uncertain instead of inventing a detail.
- **Patient stops before registration:** do not silently create or share a clinical record.
- **Clinician requests more information:** notify the patient and resume the secure workflow.
- **No prescription issued:** show the care plan; do not show an order CTA as though medicine is required.
- **Pharmacy cannot fulfil:** explain the issue and route to the authorised next step; never substitute a medicine autonomously.
- **Payment fails:** preserve the order state and show safe recovery instructions.
- **Delivery not eligible or mission interrupted:** explain that delivery cannot proceed and use an approved alternative/recovery workflow.
- **Camera stream freezes or is unavailable:** do not execute a descent based on a stale patient-selected point.
- **Recipient is unavailable:** use the defined secure handoff recovery procedure; do not leave medicine in an unapproved place.

## 7. Future drone-delivery concept

The intended experience is direct-to-home delivery using a secure medicine pod. During the final delivery phase, the patient may view the live camera, zoom in and propose a preferred delivery point within their compound.

The patient selection is a **preferred target**, not a flight-control command. A validated delivery service must independently evaluate the target, persons and objects in the area, aircraft/payload limits and operating permissions. The system must be able to reject a point and request another one. A patient-facing camera should be limited to the delivery purpose and designed with strong privacy controls.

The application should integrate with an authorised delivery operator rather than assume ALIENTO itself controls aircraft. The exact operator, API and operating model remain research questions.

## 8. Prototype MVP scope

For the hackathon software prototype:
- Android-first patient UI
- Voice/text intake screens and a clearly labelled example transcript
- Editable AI-generated health brief using demo data
- Safety notice and referral state
- Account/consent workflow
- Clinician review queue/outcome concept
- Pharmacy/order review concept using demo data
- Simulated delivery tracking and drop-zone selection, clearly marked as non-operational
- Consistent privacy and clinical decision disclaimers

Production AI, real patient records, payments, pharmacy integrations, live camera, real flight operations and clinical deployment are not implied by a working visual prototype.

## 9. Decisions still to validate

- User research and clinical/pharmacy workflow review
- Identity verification and authentication method
- Backend and database architecture
- AI, speech-to-text and text-to-speech providers
- Data retention, consent management and audit strategy
- Payment provider and reconciliation process
- Participating clinical and pharmacy partners
- Regulatory and privacy requirements for launch
- Drone hardware, operator partnerships, payload, pod and approved operating area
