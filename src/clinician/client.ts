import type { Session } from "../care/client";

export type StaffRole = { partner_id: string; staff_role: "clinician" | "coordinator" };
export type ClinicianCase = {
  case_id: string;
  created_at: string;
  case_status: "pending" | "reviewed";
  brief: Record<string, unknown>;
  reply: string | null;
};
export type CoordinationCase = {
  case_id: string;
  partner_id: string;
  created_at: string;
  case_status: "pending" | "reviewed";
  assigned_to: string | null;
};
export type EligibleClinician = { partner_id: string; clinician_id: string };
export type ClinicianConfig = { url: string; key: string };

export function createClinicianClient(config: ClinicianConfig, transport: typeof fetch = fetch) {
  const endpoint = config.url.replace(/\/$/, "");
  async function signIn(email: string, password: string): Promise<Session> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await transport(endpoint + "/auth/v1/token?grant_type=password", {
        method: "POST", headers: { apikey: config.key, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), signal: controller.signal,
      });
      if (!response.ok) throw new Error("Sign-in failed. Check your credentials and invitation.");
      const result = await response.json();
      if (typeof result?.access_token !== "string" || typeof result?.user?.id !== "string")
        throw new Error("Sign-in was not confirmed.");
      return result as Session;
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") throw new Error("Sign-in timed out. Please retry.");
      throw e;
    } finally { clearTimeout(timeout); }
  }
  async function rpc<T>(session: Session, functionName: string, payload: object = {}): Promise<T> {
    const allowed = ["care_staff_roles", "clinician_inbox", "coordination_queue",
      "eligible_clinicians", "assign_care_request", "respond_to_care_request"];
    if (!allowed.includes(functionName)) throw new Error("Unsupported care operation.");
    if (!session.access_token || !session.user.id) throw new Error("Sign in to continue.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await transport(endpoint + "/rest/v1/rpc/" + functionName, {
        method: "POST",
        headers: { apikey: config.key, Authorization: "Bearer " + session.access_token,
          "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Session expired. Sign in again.");
        if (response.status === 403) throw new Error("You are not authorised for this action.");
        throw new Error("Operation unavailable or not permitted. Refresh before retrying.");
      }
      if (response.status === 204) return null as T;
      return await response.json() as T;
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") throw new Error("Request timed out. Refresh before retrying.");
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }
  async function list<T>(session: Session, name: string): Promise<T[]> {
    const data = await rpc<unknown>(session, name);
    if (!Array.isArray(data)) throw new Error("Unexpected care service response.");
    return data as T[];
  }
  return {
    signIn,
    roles: (session: Session) => list<StaffRole>(session, "care_staff_roles"),
    clinicianInbox: (session: Session) => list<ClinicianCase>(session, "clinician_inbox"),
    coordinationQueue: (session: Session) => list<CoordinationCase>(session, "coordination_queue"),
    clinicians: (session: Session) => list<EligibleClinician>(session, "eligible_clinicians"),
    respond: (session: Session, target: string, message: string) =>
      rpc<null>(session, "respond_to_care_request", { target, message }),
    assign: (session: Session, target: string, clinician: string) =>
      rpc<null>(session, "assign_care_request", { target, clinician }),
  };
}
