export function isUrgentAnswer(answer) { return answer !== "No"; }
export function getFollowUpDestination(answer) { return isUrgentAnswer(answer) ? "urgent" : "summary"; }
export function getTabDestination(tab) { switch (tab) { case "home": return "home"; case "care": return "mycare"; case "orders": return "order"; case "you": return "profile"; } }
export function isConsentReady(name, phone, saveConsent, aiAcknowledged) { return name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10 && saveConsent && aiAcknowledged; }
