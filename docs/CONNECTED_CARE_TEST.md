# Connected care test

The opt-in patient connection uses invited email/password test accounts, HTTPS and a Supabase publishable key. Sign-in credentials and access tokens remain in memory. Closing the app requires a fresh sign-in. Records saved in the database can be loaded again after sign-in.

## Setup

The dedicated ALIENTO test project is `boihpvqsttxsvfvkjedc`, created on 2026-11-04 in Ireland (`eu-west-1`) under the confirmed organization. Supabase quoted $0/month at creation. This region was selected for fictional-data development; production hosting remains subject to review.

The care_workflow migration is applied. The hosted SQL regression check passed and rolled back its fixtures. A separate fictional partner, `5a8be5e0-04b0-40ab-a5ea-e9e3d66e8a61`, is registered for ongoing testing. .env.example includes the public connection values.

Invited patient/clinician accounts and clinician membership still need provisioning. Assignment remains an administrator operation in this milestone. The database advisor flags intentional authenticated SECURITY DEFINER workflow endpoints; their caller checks are covered by the regression tests. Private tables lack RLS but direct anon/authenticated table privileges were verified absent. Additional defense-in-depth review remains before production.

Copy .env.example to .env, supply the dedicated project values and set EXPO_PUBLIC_ALIENTO_CARE_TESTING=true. Restart Expo with its cache cleared. These values are compiled into the bundle. Use only a publishable key.

Open Consent to sign in, agree to the displayed fictional-sharing notice and submit. A case reference appears only after the server confirms saving. Open My Care, sign in if needed and refresh saved cases to read recorded responses. All requests run under the signed-in user's identity and database policies.

Retrying from the current app session reuses the original key and brief even when revisiting the screen. Keep the app open while a submission is unresolved. Cross-restart duplicate suppression and secure persistent sessions remain to be implemented. A test session accepts one brief until sign-out.

## Verification and remaining work

Transport tests cover identity headers, retry payloads, consent version and failed or malformed responses. Database checks cover patient isolation and assigned clinician access. Physical-device testing against a dedicated hosted test project remains pending.

This milestone has no self-service account registration, recovery, automatic token refresh, persistent session storage, consent withdrawal UI or clinician assignment workspace. Production authentication and consent wording require a separate implementation and review. The ordinary demo remains the default build mode.
