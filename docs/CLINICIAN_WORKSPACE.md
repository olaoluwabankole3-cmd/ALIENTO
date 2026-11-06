# ALIENTO clinician workspace — developer test milestone

## Figma reference
These screens are editable frames on the existing ALIENTO Android Patient page (no Figma page upgrade needed):
- Clinician inbox: https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=40-2
- Case review: https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=40-67
- Care coordination: https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=40-106

## Preview
Open `/clinician` on the Vercel deployment to view the clinical workspace.
The preview defaults to signed-out, with a clearly labelled **fictional UI demo** option. Demo never calls the backend or saves a response or assignment.

To enable restricted **connected** testing on a protected test deployment, set:
- `EXPO_PUBLIC_ALIENTO_STAFF_TESTING=true`
- `EXPO_PUBLIC_ALIENTO_URL` to the dedicated test project API URL
- `EXPO_PUBLIC_ALIENTO_PUBLISHABLE_KEY` to the publishable key only

Provision **invited** staff users in Supabase Auth using the approved administrator workflow; grant their membership only through privileged administrative SQL or a later audited staff-management tool. Never allow users to create their own clinical role. Never add a service-role key, secrets or medical data to browser variables. Do not enable public signups for the clinical portal.

## Data authorization
Only assigned, verified, active clinicians can view patient reports and record patient-visible outcomes. An authorised coordinator may view case ID/status/timestamp and eligible staff IDs for their own approved partner, but not symptoms. Assignment is server-validated and audited. The patient can read the response in My Care through existing RLS-protected patient queries.

All six `care_private` tables have RLS enabled and no direct client policies. SQL functions use role and partner checks on every call. Authenticated SECURITY DEFINER function advisor warnings are intentional and need detailed security review before accepting real health data.

## Outstanding
No invited test user or clinician membership is provisioned yet. This stage does not constitute a live clinic.
Before patient-data pilots: independent security review; clinical partner verification; privacy/consent review; error-handling and retries; staff onboarding; in-browser visual QA against Figma.
