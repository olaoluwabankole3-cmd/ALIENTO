# ALIENTO — Backend Architecture Proposal

**Status:** Proposed design only. No ALIENTO backend project has been created or connected.  
**Current client:** Android-first React Native + Expo + TypeScript.  
**Pilot geography:** Nigeria, subject to partner and legal review.  
**Production health data:** Not permitted until the privacy, security, clinical and partner gates below are completed.

## 1. Decision summary

Recommend **Supabase Postgres + Supabase Auth + narrowly scoped Edge Functions** as the first backend candidate. It fits the current Expo client and provides PostgreSQL, account identity, server-side functions and row-level security (RLS). The mobile client must be treated as an untrusted public client: it can contain a publishable key, but never a Supabase secret/service-role key. RLS must enforce per-user and per-assignment access, not merely check that a user is signed in.

This is a **recommendation, not a deployed integration**. The connected Supabase account currently has no project named ALIENTO. Do not reuse the existing Converge, AI research or other unrelated projects. Create a dedicated ALIENTO project only after the proposed region, project cost, account sign-in approach and privacy obligations have been reviewed.

Relevant current implementation guidance:
- [Supabase + Expo React Native quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase project regions](https://supabase.com/docs/guides/platform/regions)
- [Supabase data-residency FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq)

## 2. Proposed architecture

```text
ALIENTO Android app (public client)
  ├── Supabase Auth: sign-in/session identity
  ├── Supabase Data API: only rows allowed by RLS
  └── Authenticated Edge Functions
        ├── Submit a care request + record consent
        ├── Assign case / record clinician outcome
        ├── Append audit events
        └── Future: AI-assisted summary under approved policy
                 |
                 v
        Supabase Postgres
        ├── Profiles and organisation memberships
        ├── Care-request metadata
        ├── Patient-reported health information
        ├── Immutable consent events
        ├── Assignments and patient-visible outcomes
        ├── Separate clinician-only notes
        └── Restricted audit events
```

The diagram is the intended design, not a statement that any service is currently connected.

### Responsibilities

- **Mobile app:** collects and displays the patient's words, gives the existing urgent signposting, asks the patient to review the summary, and shows only confirmed server states. Pre-consent health text remains in local memory; it is not silently submitted to a cloud database.
- **Supabase Auth:** verifies user identity and manages sessions. Staff accounts must not gain clinician access just by signing up.
- **Postgres + RLS:** the final data-access boundary. Every table exposed through the Data API must have RLS and explicit policies.
- **Edge Functions:** validate the authenticated caller and perform state-changing workflows that must not be entrusted to a mobile client (case submission, consent receipt, assignment, clinician outcome). Each function must verify the JWT/caller identity, derive the user ID from verified claims, validate membership and case assignment, validate inputs, and append its audit event. It must not trust user IDs, roles, case statuses or approval flags sent by the client.
- **Future AI service:** called only server-side, never from the app with an embedded secret. It may organise patient-reported statements or ask bounded, approved follow-up questions; it must not independently diagnose, prescribe or make consequential care decisions.
- **Future pharmacy, payment and delivery services:** separate integrations; none is included in the first backend milestone.

## 3. Authentication decision

The final production sign-in method is still open.

The current prototype asks for a phone number on its demo verification screen, but it does not verify it. For a real build, evaluate:
- **Phone OTP:** matches a phone-first patient journey, but requires an SMS provider, operational configuration, delivery/retry limits and a cost/deliverability check in Nigeria.
- **Email OTP/magic link:** easier to develop and test, but may be less convenient for the intended audience and does not verify a phone number.
- **Google sign-in:** may be offered as an additional method, not a substitute for clinical identity or clinician credential verification.

Start with one explicitly chosen sign-in path in the development environment. Treat identity/account verification separately from clinical-sharing consent. No staff role may be self-assigned from user-editable profile fields or user metadata.

## 4. Proposed initial data model

Names below are design candidates, not deployed tables.

| Table | Purpose | Sensitive access rule |
|---|---|---|
| `profiles` | Minimal app profile: auth user ID, display name, preferred language and timestamps | Patient can read/update only their own allowed fields. Email/phone identity is managed by Auth; do not duplicate it without a defined need. |
| `care_organizations` | Approved clinic/hospital partner records | No public inserts; only approved organisations can receive cases. |
| `organization_memberships` | Organisation membership, role, status and verification metadata | A user can read their own membership status. Users cannot create or promote their own membership. |
| `care_requests` | Workflow metadata: patient, organisation, status and timestamps; no symptom narrative | Patient can read their own requests. Assigned, active, verified clinicians can read cases assigned to them. Status changes are server-controlled. |
| `patient_reports` | The actual patient-reported symptom text, duration, answers and corrections | More restricted than general operational metadata: patient owner and assigned, authorised clinician only. |
| `case_assignments` | Which clinician is authorised to review a case | Created by a trusted assignment workflow, not by a patient or arbitrary clinician. |
| `consent_events` | Append-only record of consent granted/withdrawn, scope, wording/version, timestamp and related case | Patient can read their own history. Writes are server-controlled. Do not overwrite a grant to make it appear it never happened. |
| `clinical_outcomes` | Clinician's patient-facing outcome, instructions and next-step status | Authored by an authorised assigned clinician; patient reads only outcomes for their own case. Not a prescription table. |
| `clinician_private_notes` | Confidential professional notes, if approved by partner workflow | Assigned authorised clinical staff only; not exposed to the patient app or general operations by default. |
| `audit_events` | Restricted trail of sensitive reads/writes and important state transitions | No direct mobile writes. Never store symptom text, passwords, tokens or unnecessary personal data in audit metadata. |

Do not add pharmacy inventory, payment details, voice recordings, GPS histories or drone telemetry to this initial schema. Those require their own use cases, data-retention rules and partner agreements.

## 5. Care-request workflow

1. **Before consent:** symptoms, corrections and follow-up answers remain in local app state. No server-side care record is created from the demo flow.
2. **Identity:** the patient signs in using the selected method. Identity verification is not equivalent to consent.
3. **Review:** the patient sees and corrects their report and is given a clear privacy notice explaining the purpose, recipients, rights, retention and lawful basis.
4. **Consent and submit:** a protected server workflow validates the request, records the applicable consent version/event where consent is the chosen lawful basis, creates the request/report, and emits an audit event. The client cannot directly set a submitted/approved status.
5. **Triage and assignment:** the system assigns only to an approved partner and an active, verified clinician membership. No unauthorised person can query a general case queue.
6. **Review:** the clinician records an authorised outcome. Patient-facing instructions are stored separately from private notes. Appointments are pending until actually confirmed.
7. **Follow-up or closure:** status changes occur through validated server workflows. A change to the case does not silently rewrite prior consent history.
8. **Urgent signposting:** the existing severe/uncertain answer continues to show urgent in-person care guidance on the client. This is not a diagnosis or a clinical emergency assessment. The app must not delay urgent care while waiting for a network, AI or clinician response.

The case submission workflow should be idempotent so repeated taps or a flaky connection do not create duplicate cases.

## 6. Initial access-control matrix

| Actor | Own profile | Own patient report | Assigned case | Clinician private notes | Membership changes | Audit events |
|---|---|---|---|---|---|---|
| Unauthenticated visitor | None | None | None | None | None | None |
| Patient | Read/update limited fields | Read own case data after authorised creation | Own cases only | None | None | No direct access |
| Unassigned clinician | Own profile and own membership status | None | None | None | None | None |
| Active assigned clinician | Own profile/membership | Assigned cases only | Assigned cases only | Assigned cases only | None | No general direct access |
| Care operations | Limited profile/membership and permitted operational metadata | No symptom narrative by default | Only authorised workflow metadata | None by default | No self-promotion | Via restricted audit workflow |
| Pharmacy partner | None until a later approved integration | No direct access by default | Prescription/order fields only after a future valid authorisation | None | None | Restricted integration events |
| Trusted server workflow | Only operations explicitly designed for it | Validated access for its task | Validated transitions only | Role/purpose-limited | Admin workflow only | Append only |

Implementation notes:
- Enable RLS on every exposed table, with explicit grants and policies.
- A policy must constrain ownership or active case assignment; `TO authenticated` alone is not sufficient.
- For updates, enforce both row visibility and the resulting row state so a patient cannot reassign ownership or set themselves as a clinician.
- No public user can write membership, assignment, clinician outcome, consent history or audit records directly.
- Do not use user-editable metadata to authorise staff.
- Keep sensitive tables out of broad operational views. If views are added, explicitly review whether they preserve RLS.
- Use least-privilege API grants. Never ship a service-role/secret key in the mobile bundle.
- Check that revoked/suspended memberships stop granting access. JWT role claims can become stale; sensitive operations must confirm current membership on the server.

## 7. Privacy, hosting region and launch gates

ALIENTO is intended to process health-related information. The Nigeria Data Protection Act identifies health status as sensitive personal data, and section 28 requires a data privacy impact assessment before processing where processing is likely to create high risk. These obligations need a qualified privacy/legal review, not a checkbox alone:
- [Nigeria Data Protection Act, 2023 — NDPC official page](https://www.ndpc.gov.ng/ndp-act-2023/)
- [NDPC resources](https://ndpc.gov.ng/resources/)
- [NDPA section 28 — DPIA text](https://techmeetslaw.org/laws/data-protection-act-2023/section-28-ndpa/)

Before real patient data is accepted, ALIENTO needs an approved lawful-basis and privacy-notice design, data-controller/processor responsibilities, a documented DPIA where required, retention/deletion and rights-handling procedures, incident response, vendor agreements and a review of cross-border transfers.

**Hosting region remains unresolved.** The current published Supabase region list should be checked again at project creation; its explicit list does not currently show a Nigeria/Africa AWS region. Supabase states that the chosen region determines primary data location, but that region choice alone is not proof of legal compliance, and its data-residency FAQ describes limited processing outside the selected region. Do not assume an EU region is automatically acceptable for Nigerian health data. Confirm the available regions, subprocessors, contract terms and transfer safeguards with appropriate advice before choosing the project region or accepting real data.

No project has been created for ALIENTO as part of this step. No production or patient data is involved.

## 8. Delivery plan

### Backend milestone A — Prepare the foundation
- [x] Document a proposed backend and security boundary.
- [x] Define initial entities and role-based access expectations.
- [ ] Confirm project region and projected cost before provisioning a dedicated ALIENTO project.
- [ ] Confirm the first authentication path and partner/clinical workflow assumptions.
- [ ] Complete a privacy/legal review of the proposed region and processing plan before real health data.

### Backend milestone B — Local schema and security tests
- [ ] Initialise Supabase CLI/configuration in the repository and generate the first migration using the CLI.
- [ ] Build tables, enums, constraints and indexes for profile, organisation/membership, care-request, report and consent entities.
- [ ] Add RLS policies and server-controlled state transitions.
- [ ] Add isolated fixture users for patient A, patient B, assigned clinician and unassigned clinician.
- [ ] Prove cross-patient and unassigned-clinician reads/writes are denied before connecting the UI.

### Backend milestone C — Authentication and first secure workflow
- [ ] Configure the selected Auth method and development-only environment variables.
- [ ] Implement session persistence and sign-out in Expo.
- [ ] Create the server-side consent-and-submit workflow.
- [ ] Connect the patient app to read only the signed-in patient's own cases.
- [ ] Test expired sessions, retry/idempotency, revoked consent and network failure states.

### Later milestones
Clinician workspace, AI voice services, licensed pharmacy, payments, live delivery and drones remain separate phases. None should be treated as live until connected, tested and approved.

## 9. Acceptance criteria for the first real-data pilot

Do not pass this gate until:
- The selected region, transfer safeguards, privacy notices and processing roles have been reviewed.
- A DPIA is completed where required and any high residual risk is addressed.
- RLS tests prove patient A cannot access patient B's data.
- An unassigned, inactive or unverified clinician cannot retrieve a case.
- Patients cannot directly set case statuses, clinician outcomes or organisation memberships.
- Consent grant/withdrawal events are append-only and tied to the correct purpose/version.
- Private clinical notes are not visible in patient or general operations queries.
- Secret keys are absent from the app bundle and Git repository.
- Retention, erasure/access requests, backups, incident response and operational support are documented.
- Qualified clinical partners have reviewed the intended workflow. This prototype and these technical checks do not constitute clinical validation or regulatory approval.
