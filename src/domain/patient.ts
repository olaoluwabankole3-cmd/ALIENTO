export type Page = "welcome" | "home" | "voice" | "followup" | "summary" | "consent" | "pending" | "careplan" | "pharmacy" | "order" | "delivery" | "dropzone" | "mycare" | "profile" | "urgent";
export type Answer = "No" | "Yes" | "Not sure";
export type Spot = "Front entrance" | "Gate" | "Open courtyard";
export type Data = {
  language: "English" | "Pidgin"; symptoms: string; duration: string; vomiting: Answer;
  severe: Answer; notes: string; name: string; phone: string; saveConsent: boolean;
  aiAcknowledged: boolean; address: string; spot: Spot; notifications: boolean;
};
export type TabKey = "home" | "care" | "orders" | "you";

export const initial: Data = {
  language: "English", symptoms: "My body dey hot since yesterday. I feel weak, and I have not been eating well.",
  duration: "Since yesterday", vomiting: "No", severe: "No", notes: "", name: "", phone: "",
  saveConsent: false, aiAcknowledged: false, address: "", spot: "Front entrance", notifications: true,
};

export const urgentCopy = "If you have severe difficulty breathing, severe chest pain, heavy bleeding, fainting, confusion, or another life-threatening symptom, seek urgent in-person medical care or contact local emergency services now. Do not wait for this app.";
