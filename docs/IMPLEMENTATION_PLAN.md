# ALIENTO — Implementation Plan

**Current phase:** Phase 1 — product definition and design  
**Implementation status:** Not started  
**Repository:** `olaoluwabankole3-cmd/ALIENTO`

## Gate 0 — Product and design agreement

Before coding the app:
- Review and approve the patient journey in the [Figma design](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2).
- Finish visual QA for all 14 patient artboards.
- Audit and correct all clickable prototype interactions, including back navigation and bottom navigation.
- Finalise the consent, identity verification, clinical-review and no-prescription branches.
- Confirm the selected 3D logo and export production-ready application assets.
- Review key journeys with prospective users and, where possible, qualified clinical/pharmacy advisors.

**Exit criterion:** A reviewer can follow the primary patient journey in Figma without dead ends or misleading status changes.

## Gate 1 — Mobile app foundation

Proposed stack: React Native + Expo + TypeScript, pending confirmation at implementation time.

Work:
- Initialise Expo project with strict TypeScript and predictable folder structure.
- Configure linting, formatting, environment validation and type-check/build scripts.
- Implement design tokens and typography from the approved Figma design.
- Build shared mobile primitives: buttons, inputs, status labels, cards, navigation and voice-interaction states.
- Add accessible sizing, safe-area behaviour, keyboard handling and responsive layouts.
- Add an explicit demo-mode flag so simulated workflows cannot be mistaken for live services.

Acceptance:
- Android development build launches successfully.
- Main screens render from reusable components, not duplicated hard-coded styling.
- No live provider secret is bundled in the mobile app.

## Gate 2 — Patient experience (demo data)

Build in this order:
1. Welcome, entry and language preferences
2. Voice/text intake UI, transcript editing and simulated listening states
3. Follow-up questions and red-flag presentation
4. Editable health brief
5. Account verification UI and explicit consent
6. Clinical request status
7. Clinician-led consultation/care-plan concept
8. Prescription and pharmacy order concepts
9. Order review and price transparency
10. Simulated future drone tracking and drop-zone selection
11. My Care, profile and privacy preferences

Acceptance:
- Each primary action has a meaningful destination and loading/error/empty states.
- Demo content is clearly labelled.
- No screen claims that a real clinician, pharmacy, payment, camera or drone is connected unless that integration exists.

## Gate 3 — Backend and identity design

Choose architecture only after product requirements and available partner constraints are reviewed.

Potential work:
- Authentication, identity verification and consent receipts
- Database model and per-user/role authorisation
- Patient records, case/workflow status, clinician review, prescription and pharmacy order references
- Audit events for sensitive access and consequential actions
- Server-side AI gateway with schema validation, request limits, red-flag handling and provider abstraction
- Secure object storage and retention/deletion policy

Acceptance:
- Row-level or equivalent authorisation tests prove one patient cannot access another patient's records.
- Clinical and pharmacy roles can only access their authorised workflows.
- Secrets and privileged calls remain server-side.
- AI outputs are schema-validated and labelled as support for—not a replacement for—clinical decisions.

## Gate 4 — Clinical and pharmacy pilot readiness

- Secure review by qualified clinicians and pharmacy partners
- Operational policies for consultation, prescription validity, dispensing, unavailable stock, substitutions, follow-up, complaints and refunds
- Required privacy, data protection and health-sector compliance assessment
- Incident response, audit review and support processes
- Small controlled partner pilot before broader availability

## Gate 5 — Drone R&D and integration

This is a separate engineering stream and a later launch dependency:
- Define aircraft and secure-pod payload requirements
- Research eligible hardware and authorised delivery partners
- Develop the operator integration contract and mission-state model
- Design target-selection, camera privacy, stale-stream handling, reject/redirect and failed-handoff flows
- Conduct simulation and controlled testing with appropriate expertise and approvals
- Integrate only after a real operator, API and approved operating model are identified

The drone must retain independent safety controls; a patient-selected point is a preferred destination, not a command to pilot or descend.

## Gate 6 — Launch readiness

Launch only after the product, clinical and pharmacy operations, data protection controls, payment fulfilment and delivery operating model are validated for the intended region. A visual prototype or hackathon demo is not launch authorisation.
