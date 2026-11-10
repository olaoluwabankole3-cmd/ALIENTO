import type { Answer, Page, TabKey } from "../domain/patient";
export function isUrgentAnswer(answer: Answer): boolean;
export function getFollowUpDestination(answer: Answer): Page;
export function getTabDestination(tab: TabKey): Page;
export function isConsentReady(name: string, phone: string, saveConsent: boolean, aiAcknowledged: boolean): boolean;
