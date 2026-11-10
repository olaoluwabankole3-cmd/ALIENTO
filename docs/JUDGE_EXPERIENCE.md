# ALIENTO judge experience

**Stable public URL:** https://aliento-web.vercel.app

**Figma source:** https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=46-2

The public website on desktop (>1179 px) introduces ALIENTO beside a *live*, responsive patient app in a mint-framed viewport. It shows the product premise and three stages of the proposed patient-to-clinician journey. The left-hand **Explore patient journey** action resets the patient app to a fictional intake screen, not a recording flow. **Clinician workspace** opens `/clinician?demo=1`, a fictional, write-disabled staff UI that does not require accounts. Mobile/tablet continues to use the original 412-pixel Figma patient-first layout, including Welcome.

This is still a fictional-data prototype, not a medical care service. No microphone recordings, clinician assignments or clinical responses are performed by public demo actions. The functional clinical backend remains gated from the public build.

For regression review:
- public URL stays **unchanged**
- check desktop widths >=1180, tablet widths 768-1179, narrow mobile widths 320-390
- verify every CTA does what its label promises
- test patient urgent guidance and all 4 tabs
- confirm `/clinician?demo=1` clearly indicates fictional data and disables response/assignment writes
- ensure voice transcript edit, brief review and consent preview remain functional
- confirm both web bundle and Android JavaScript export pass
- public release is done *after* preview checks using the existing Vercel project/domain
