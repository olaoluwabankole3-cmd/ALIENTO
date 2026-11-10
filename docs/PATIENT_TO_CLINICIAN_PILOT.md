# ALIENTO — Complete fictional patient-to-clinician test workflow

**Figma source:** [Connected My Care status](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=42-2). This is an editable variant of the original ALIENTO My Care design.

## Backend

Migration `20261106000100_patient_care_progress.sql` adds `patient_case_progress()`, a read-only, patient-owned, ordered status API. It returns:
- `submitted`: patient consent + request recorded
- `assigned`: an authorised coordinator assigned a clinician
- `reviewed`: an assigned, verified clinician recorded a patient-facing response

Only the authenticated patient who owns the case can read its progress. The result contains no clinician ID, coordinator membership, unrelated patient details, or private notes. The function validates ownership from `auth.uid()` and explicitly revokes `anon`/public execute. The staff-side APIs remain separate.

The Expo My Care view uses the Figma-based three-card design, loads on opening when signed in, and offers explicit refresh. It does **not** claim live notifications. Demo mode is unaffected.

## Integration tests

`supabase/checks/patient_care_progress.sql` runs a transactional, rollback-only end-to-end check as four fictional database actors: submitting patient, other patient, coordinator and assigned clinician. It asserts a full submission–assignment–response round-trip, audit trail, cross-patient isolation, and no coordinator access to health narratives. All generated rows are rolled back. CI runs this alongside existing clinical-isolation tests.

This is **not** an end-to-end test of browser login, invitation emails, clinical qualifications or a genuine patient consultation.

## Invited-account setup

1. In [Supabase Authentication → Users](https://supabase.com/dashboard/project/boihpvqsttxsvfvkjedc/auth/users), invite distinct, controlled test inboxes for a patient, a care coordinator and a designated clinician. Do not use sample placeholder emails as real invitations.
2. After invitations are accepted, look up each user's generated UUID in the Auth dashboard. Do not ask testers to share passwords or session tokens.
3. Confirm that the clinician is authorised by the pilot partner and independently verify professional qualifications before setting `care_private.clinicians.verified=true`. A test label alone does not establish professional qualification. Create only the intended partner memberships through the privileged Supabase SQL editor, with `active=false` until approval. There is no self-enrolment path.
4. After operational approval, enable the test-only `EXPO_PUBLIC_ALIENTO_CARE_TESTING` and `EXPO_PUBLIC_ALIENTO_STAFF_TESTING` build flags on a **protected, restricted preview only** and supply the **publishable** key, URL and approved partner UUID. Never put the secret/service-role key into any `EXPO_PUBLIC_*` variable. Rebuild and verify.
5. Use fictional health data only. Sign in as patient to submit, coordinator to assign, clinician to respond, then patient again to refresh My Care. Check audit events and row isolation.

The current test project has zero invited accounts, so **the final browser-authenticated pilot cannot yet be claimed complete**. Professional vetting, privacy assessment, clinical-partner sign-off, and independent security testing remain launch gates.
