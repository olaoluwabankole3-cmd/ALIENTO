# Figma screens — Review Status and My Care

Figma file: https://www.figma.com/design/ITcHMZilZaSAOSlhXSSGQA?node-id=9-2

- `17:20` Clinician review — pending: original dark status card, progress halo, three numbered steps, and review CTA. While clinical services are unavailable, **status is clearly labelled simulated**; no account, clinician assignment or appointment is implied.
- `22:69` My Care: original ALIENTO heading, dark active-care hero, three white activity tiles, and four-tab navigation. Activity tiles navigate to *sample* appointment/prescription/order screens. No real records are created.
- Original Figma assets for review halo, numbered indicator and activity tile were exported and committed under `assets/figma`.

The connected test mode continues to use the existing authenticated `CareConnection` with the Supabase test database; public web preview stays in demo mode. Future live My Care cards must be populated only from authenticated, access-controlled case data.
