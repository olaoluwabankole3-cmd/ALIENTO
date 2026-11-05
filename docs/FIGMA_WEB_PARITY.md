# Figma parity — ALIENTO browser preview

**Source of truth:** [ALIENTO — Android Patient](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2).
The canonical Home screen is node `9:21`, at 412 × 915 design pixels.

The Expo web implementation reuses the Android patient flow instead of inventing a desktop dashboard. It retains the Figma palette (#F4F8F6, #051C1E, #42E6AC, #C8F75B), Manrope on web, the locally committed ALIENTO 3D emblem, and the four-tab bottom navigation. At desktop widths the view is centered within a 412 px content frame; at smaller widths it fills the browser.

The Home layout includes the approved greeting, dark hero and 3D mark, urgent guidance strip, care thread timeline, and floating navigation. The hero, urgent strip, care thread and navigation remain interactive and route into the existing Expo flows.

**Browser-specific adjustment:** a mock status indicator appears inside the web preview to match the original 412 × 915 Figma board; native Android continues using its real status bar.

**Verification:** GitHub Actions `Expo web design checks` runs tests, type checking and the Expo web export on every development-branch change. This checks that the web bundle builds; *pixel-level visual QA and the remaining individual screens still require browser inspection*.

This is a fictional-data prototype, not a real healthcare service. `EXPO_PUBLIC_ALIENTO_CARE_TESTING` must remain disabled on publicly available builds. Do not submit real patient information.
