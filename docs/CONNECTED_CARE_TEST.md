# Connected care test

The opt-in patient connection uses invited email/password test accounts, HTTPS and a Supabase publishable key. Sign-in credentials and access tokens remain in memory. Closing the app requires a fresh sign-in. Records saved in the database can be loaded again after sign-in.

## Setup

Use a dedicated ALIENTO test project after approving its owner, region and cost. Apply the versioned migrations. A trusted administrator must register an approved fictional partner, invited patient/clinician accounts and clinician membership. Assignment remains an administrator operation in this milestone.

Copy .env.example to .env, supply the dedicated project values and set EXPO_PUBLIC_ALIENTO_CARE_TESTING=true. Restart Expo with its cache cleared. These values are compiled into the bundle. Use only a publishable key.

Open Consent to sign in, agree to the displayed fictional-sharing notice and submit. A case reference appears only after the server confirms saving. Open My Care, sign in if needed and refresh saved cases to read recorded responses. All requests run under the signed-in user's identity and database policies.

Retrying from the current app session reuses the original key and brief even when revisiting the screen. Keep the app open while a submission is unresolved. Cross-restart duplicate suppression and secure persistent sessions remain to be implemented. A test session accepts one brief until sign-out.

## Verification and remaining work

Transport tests cover identity headers, retry payloads, consent version and failed or malformed responses. Database checks cover patient isolation and assigned clinician access. Physical-device testing against a dedicated hosted test project remains pending.

This milestone has no self-service account registration, recovery, automatic token refresh, persistent session storage, consent withdrawal UI or clinician assignment workspace. Production authentication and consent wording require a separate implementation and review. The ordinary demo remains the default build mode.
