# ALIENTO — controlled invited-account pilot

**Scope:** Dedicated fictional-data Supabase test project only (`boihpvqsttxsvfvkjedc`). Never use this procedure to process real patients before privacy, security and clinical reviews.

## Current state (6 November 2026)

The test project has no provisioned Supabase Auth users, clinicians, coordinators or submitted cases. SQL regression suites create fictional identities within a transaction and roll them back. Those identities cannot sign in using the web/mobile apps.

The complete patient → coordinator → assigned clinician → patient process is now implemented in the database and exercised in local transaction-based tests. The patient app's My Care timeline reads the authenticated `patient_case_progress()` API. The web clinical portal remains a protected preview and its sample UI makes no backend writes.

## Provision the first three accounts

1. In [ALIENTO Supabase Authentication → Users](https://supabase.com/dashboard/project/boihpvqsttxsvfvkjedc/auth/users), a project administrator invites **three separate consenting testers**: one patient, one coordinator and one clinician. Invite through Supabase Auth, not SQL inserts into `auth.users`. Testers set their own passwords; do not share passwords, invitation tokens or Auth session tokens in chat.
2. Confirm the care organisation and the clinician's identity, medical registration, credentials and active membership through a documented, independent verification process. **A title, app sign-in or self-description does not qualify anyone for clinician permission.** The coordinator must also be authorised by that partner. Use fictional details even when testing with verified professionals.
3. After explicit approval, a privileged project administrator associates the exact invited Auth UUIDs with the correct partner. Never grant staff membership from frontend code, user-editable metadata or unreviewed SQL. The underlying tables `care_private.clinicians` and `care_private.coordinators` have no direct client grants. The administrator must check user IDs and partner IDs twice and record the approver and verification evidence in a private onboarding record.
4. Use a separate **restricted deployment** for connectivity checks. Its publishable key may be compiled into the client, but *never* a service-role / secret key. For the restricted build only, configure `EXPO_PUBLIC_ALIENTO_URL`, `EXPO_PUBLIC_ALIENTO_PUBLISHABLE_KEY`, `EXPO_PUBLIC_ALIENTO_PARTNER_ID`, `EXPO_PUBLIC_ALIENTO_CARE_TESTING=true`, and `EXPO_PUBLIC_ALIENTO_STAFF_TESTING=true`. Keep the public Vercel preview in demo mode.

## Acceptance script (all information fictional)

| Actor | Action | Required proof |
|---|---|---|
| Invited patient | Sign in, review test brief, give explicit test-sharing consent, submit | One confirmed reference; one submission audit entry; retry does not duplicate |
| Same patient | Re-open My Care | Own case appears with `submitted`; no other patient's cases |
| Authorised coordinator | Open care coordination | Only case references, statuses and dates; never patient symptoms |
| Coordinator | Assign the case to eligible clinician | Verified, active and same-partner clinician selected; one assignment/audit entry |
| Patient | Refresh My Care | Own stage becomes `assigned`, clinician identity remains undisclosed |
| Assigned clinician | Open inbox; review and send fictional response | Can read only their assignment; response saved once; reviewed audit event |
| Patient | Refresh My Care | Stage `reviewed`, exact response shown |
| Unauthorized clinician / different patient / other-partner coordinator | Try to access the case | Request denied or empty results, no data leakage |

Do not equate CI tests with authenticated UI testing. The SQL round-trip verifies role-based data behavior with fictional transaction-scoped identities; the browser/mobile sign-in and full live journey are **not verified until the invitations and memberships are provisioned**.

## Operational and clinical release gates

Before real patient activity: independent review of privileged SQL functions and row access; safe staff provisioning and revocation procedure; clinician credential verification; approved clinical safety workflow; production consent/privacy notice, DPIA, retention and incident response; cross-border health-data assessment; token refresh and session security; secure user deletion/withdrawal flows; and notification design.

The app is not a substitute for emergency medical care.
