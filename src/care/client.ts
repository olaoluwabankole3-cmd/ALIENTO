export type Session = { access_token: string; user: { id: string } };
export type CareCase = {
  case_id: string; submitted_at: string;
  stage: "submitted" | "assigned" | "reviewed";
  outcome: string | null;
};
export type CareConfig = { url: string; key: string; partner: string };
export function createCareClient(config: CareConfig, transport: typeof fetch = fetch) {
  async function request(path: string, token?: string, body?: unknown) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const result = await transport(config.url.replace(/\/$/, "") + path, {
        method: body === undefined ? "GET" : "POST",
        headers: { apikey: config.key, "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      if (!result.ok) {
        if (result.status === 401) throw new Error("Please sign out and sign in again.");
        throw new Error("The request could not be completed. Check your connection and try again.");
      }
      return await result.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError")
        throw new Error("The request timed out. Retry to check the same submission.");
      throw error;
    } finally { clearTimeout(timeout); }
  }
  return {
    async signIn(email: string, password: string): Promise<Session> {
      const result = await request("/auth/v1/token?grant_type=password", undefined, { email, password });
      if (!result.access_token || !result.user?.id) throw new Error("Sign-in was not confirmed.");
      return result;
    },
    async submit(session: Session, key: string, report: object): Promise<string> {
      const id = await request("/rest/v1/rpc/submit_care_request", session.access_token, {
        partner: config.partner, retry_key: key, report, consent_version: "local-care-review-v1",
      });
      if (typeof id !== "string") throw new Error("Submission was not confirmed. Retry the same request.");
      return id;
    },
    async cases(session: Session): Promise<CareCase[]> {
      const result = await request("/rest/v1/rpc/patient_case_progress", session.access_token, {});
      if (!Array.isArray(result) || !result.every(item =>
        item && typeof item.case_id === "string" && typeof item.submitted_at === "string" &&
        ["submitted", "assigned", "reviewed"].includes(item.stage) &&
        (item.outcome === null || typeof item.outcome === "string")))
        throw new Error("Cases could not be loaded.");
      return result as CareCase[];
    },
  };
}
