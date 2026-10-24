# ALIENTO — Android Design Specification (working draft)

**Design source:** [ALIENTO — Android Patient in Figma](https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2)  
**Figma page:** ALIENTO — Android Patient  
**Frame format:** 412 × 915 px artboards  
**Status:** Screens are in progress; visual and prototype QA is still required before implementation.

## Brand direction

The selected identity uses the glossy, sculptural 3D ALIENTO mark with a deep teal background, emerald transitions and mint highlights. The mark represents breath, movement and a connected path to care. The 3D mark is the hero asset; simplified versions may be used only where a small asset or technical constraint requires them.

The supplied logo art has been placed into the welcome and home logo slots at optimised preview resolution. Replace that preview-resolution use with the approved production asset when preparing final export assets.

## Design tokens

| Token | Hex | Intended use |
|---|---|---|
| Canvas | `#F4F8F6` | Main patient-app background |
| Surface | `#FFFFFF` | Inputs and content surfaces |
| Ink | `#051C1E` | Primary dark surfaces and core brand background |
| Ink soft | `#0C3332` | Secondary dark surfaces |
| Pulse mint | `#42E6AC` | Primary action, voice focus and positive states |
| Pulse lime | `#C8F75B` | Distinctive highlight for future delivery concepts |
| AI violet | `#7F71F5` | AI-specific details, used sparingly |
| Mist | `#E2F7EF` | Soft mint backgrounds |
| AI mist | `#F0EEFF` | Soft AI backgrounds |
| Text | `#0F2323` | Main text on light surfaces |
| Muted | `#607775` | Supporting text |
| Border | `#D8E6E0` | Dividers and input borders |
| Danger | `#EA4F5D` | Safety alerts only |
| Danger soft | `#FFF0F2` | Emergency/safety warning backgrounds |

**Typography:** Manrope. Use strong hierarchy, restrained weights, accessible body text and clear line spacing. Keep voice-centric controls recognisable and easy to reach with one hand.

## Interaction principles

- Mobile-first layouts; controls should be comfortably tappable.
- Voice is the primary entry point, but text is always available.
- Patient-facing copy should be calm, plain and non-judgmental.
- Clearly distinguish patient-reported information from AI-organised summaries.
- Avoid labels that imply a diagnosis from the AI.
- Use red only for genuine safety warnings; it is not a decorative accent.
- Distinguish pending, confirmed, completed and simulated states with both labels and visual treatment.
- A requested appointment is not confirmed until the provider confirms it.
- A medicine order is not offered unless a valid prescription has been issued through the appropriate workflow.
- Camera/drop-zone screens must state that the target is a preference and is subject to independent safety validation.
- The drone screens are concept screens only; they must never imply a real camera feed or live flight is connected.

## Patient screen inventory

Screen node IDs below refer to the current working Figma file. The exact positions and prototype wires may change during design review.

| Order | Screen | Figma node | Purpose |
|---:|---|---|---|
| 00 | Welcome | `16:3` | Brand introduction and primary entry |
| 01 | Home | `9:21` | Voice-first starting point and care summary |
| 02 | Voice intake | `9:80` | Capture and correct the patient's words |
| 03 | AI follow-up | `9:125` | Ask bounded clarifying questions and show safety guidance |
| 04 | Health summary | `9:166` | Review an editable health brief before sharing |
| 05 | Account verification and consent | `22:2` | Verify identity and obtain explicit clinical-sharing consent |
| 06 | Clinician review — pending | `17:20` | Represent the pending human review state |
| 07 | Consultation and care plan | `22:38` | Explain the clinician-led next step and prescription conditions |
| 08 | Prescription and pharmacy | `17:54` | Display the valid prescription/pharmacy workflow |
| 09 | Order review and home location | `18:2` | Confirm address, preferred delivery zone and price transparency |
| 10 | Drone delivery tracking — concept | `17:83` | Communicate a simulated future delivery state |
| 11 | Live camera and drop zone — concept | `17:123` | Show a proposed final-stage camera and preferred-point selection |
| 12 | My care | `22:69` | Patient access to health briefs, appointments, prescriptions and orders |
| 13 | Profile and preferences | `22:106` | Language, notifications, privacy and accessibility |

## Primary journey

Welcome → Home → Voice intake → AI follow-up → Health summary → Account verification/consent → Clinician review → Consultation/care plan when needed → Prescription/pharmacy only if prescribed → Order review → Delivery tracking when eligible → Final drop-point concept.

Some routes branch. A patient may need urgent assessment, a consultation without medication, or no further action. No medicine purchase is compulsory.

## What must be reviewed before coding

1. Visual hierarchy, spacing, contrast and text fit across all 14 screens.
2. Correct use of the exact selected 3D brand artwork, including light/dark backgrounds and app-icon exports.
3. Every prototype link, including back navigation, the bottom navigation, account/consent transition, pharmacy/order transition and simulated drone states.
4. All drone screens display a visible concept/simulation disclaimer.
5. All states and labels reflect the product rules in `PRODUCT_SPEC.md`.
6. The full experience at actual Android device sizes, not only the 412 × 915 reference artboard.

The Figma prototype wiring is not yet fully QA-verified. Do not treat the existence of the screens as proof that all links work correctly.
