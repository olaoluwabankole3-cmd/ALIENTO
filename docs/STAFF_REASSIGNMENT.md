# Case recovery after clinician suspension

A pending case assigned to a clinician whose membership is inactive or no longer verified must not remain stuck. The coordinator's metadata-only queue exposes that case as actionable; the patient stage returns to `submitted` while no valid clinician is assigned.

An approved coordinator may use the existing assignment button to allocate it to another active, verified clinician at the same approved partner. This is **not** a general override: assignments to an available clinician cannot be changed through the client. Coordinators may not assign themselves, including dual-role staff. Both the original and replacement IDs, acting coordinator and fixed recovery reason are retained in `care_private.assignment_changes` and an additional `reassigned` case audit event. The private history is not exposed to patient, clinician, or coordinator clients.

A clinician's membership is checked again at each read and response attempt, so revocation takes effect on the next request, even if an access token has not expired. Database transaction tests cover revoked clinician access, cross-partner isolation, self-assignment denial, stalled case recovery, response visibility and idempotent retries.

Only fictional data may be used for pilot testing. A staffed clinical incident response and administrator-controlled case escalation route remain release gates.
