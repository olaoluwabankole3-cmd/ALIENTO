# ALIENTO Android release

## Device test build

Open the successful **Android tester APK** run on the feature pull request. Download the **ALIENTO-android-tester** artifact, extract the APK and install it on a test phone. It runs independently of Expo Go. This APK uses the template’s test key. Use fictional information throughout testing.

| Device check | Expected result |
| --- | --- |
| Launch offline | Welcome explains the preview before any input. |
| Enter sample text and use Android Back | The previous screen opens and the in-session text is preserved. |
| Choose a severe or uncertain follow-up answer | The urgent-guidance screen opens. |
| Leave a required consent box unchecked | The simulated submission cannot proceed. |
| Force-stop the app and reopen | The app starts a fresh demo session. |
| Enable large text and TalkBack | Required controls, labels and warnings remain readable and reachable. |

Record the build commit, phone model, Android version and observed results. Resolve failures before promoting a build.

## Google Play internal testing

1. Confirm that the publishing organization owns the Play Console account, the Expo project and the Android package name `com.aliento.patient`. Verify that this identifier is available to the organization before the first upload.
2. From the feature branch run `npm ci --no-audit --no-fund`. Sign in to the organization’s Expo account and run `eas init` to link its ALIENTO project. Review and commit the resulting project ID. Use the organization's upload key or establish an organization-controlled key with a recovery process.
3. Run `eas build --platform android --profile production` to generate the signed Android App Bundle. Record the commit, build URL, version code and signing certificate fingerprint. Keep credentials outside git.
4. In Play Console, create the app and configure Play App Signing. Upload the AAB to **Internal testing**. Inspect the bundle’s package, target SDK, native compatibility and requested permissions in App Bundle Explorer. Resolve Play validation errors.
5. Install through the tester opt-in link and repeat the device checks on the Play-delivered build. Confirm that upgrades preserve the intended behavior.

## Before public release

- Implement and test one real patient journey through identity, consent, secure case submission, an assigned clinician’s review, and a patient-visible outcome. Remove or clearly segregate simulated pharmacy and delivery features from the real service.
- Confirm clinical partner coverage, escalation handling and the privacy arrangements for actual patient data before enrolling patients.
- Publish an accessible privacy policy for the actual release, with the responsible organization and its monitored contact. Link it in the app and in Play Console. Review dependencies, permissions and actual data flows before completing Data safety and the Health apps declaration.
- Prepare the release icon, feature graphic, phone screenshots, listing text, support details, content rating, audience and reviewer access instructions. Describe only features available to the intended users.
- Review Play’s pre-launch report, crashes, accessibility findings and device compatibility. Complete applicable testing or production-access requirements. Use a staged rollout with a named owner for incident response.

[Play developer account types](https://support.google.com/googleplay/android-developer/answer/13634885) · [Health policy](https://support.google.com/googleplay/android-developer/answer/16679511) · [Target Android API](https://support.google.com/googleplay/android-developer/answer/11926878) · [Play testing tracks](https://support.google.com/googleplay/android-developer/answer/9845334)
