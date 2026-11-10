# Browser preview (Vercel)

ALIENTO is a universal Expo application. The browser build uses the same patient screens as the Android test build, centered in a narrow viewport on desktop.

## Deployment

- Source: the development branch `feat/android-patient-app-20261024`. Do **not** merge the draft pull request into `main` until reviewed.
- Vercel: repository root, no framework preset, `npx expo export --platform web`, output directory `dist`, Node 22.
- `vercel.json` configures single-page navigation fallback.
- For local preview after dependencies are committed: `npm ci && npx expo start --web`.
- For browser build verification: `npm ci && npx expo export --platform web`.

## Important safety controls

The initial public Vercel deployment is **fictional demo mode only**. Leave `EXPO_PUBLIC_ALIENTO_CARE_TESTING` unset or `false` in public web builds. Do not input real patient data, passwords for real accounts, prescriptions, or clinician notes.

The dedicated ALIENTO Supabase test backend remains separate from Vercel hosting. Before inviting external users to any connected patient flow, complete test account provisioning, privacy/security review (including privileged functions and RLS defense in depth), and a controlled access plan. Only Supabase publishable keys may be placed in an `EXPO_PUBLIC_` variable. NEVER deploy a Supabase service-role/secret key to browser code.

Known demo limits: microphone/voice preview is illustrative, clinician and pharmacy services are not live, and Play Store publication is a separate milestone.
