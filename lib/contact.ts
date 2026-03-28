export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

export function normalizeContactPayload(input: unknown): ContactPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Missing contact form data.");
  }

  const data = input as Record<string, unknown>;

  const payload: ContactPayload = {
    firstName: toRequiredString(data.firstName, "First name"),
    lastName: toRequiredString(data.lastName, "Last name"),
    email: toRequiredString(data.email, "Email"),
    phone: toOptionalString(data.phone),
    company: toOptionalString(data.company),
    message: toRequiredString(data.message, "Project goals")
  };

  if (!isValidEmail(payload.email)) {
    throw new Error("Please enter a valid email address.");
  }

  return payload;
}

export function buildContactEmailText(payload: ContactPayload) {
  return [
    `Name: ${payload.firstName} ${payload.lastName}`.trim(),
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Company: ${payload.company || "Not provided"}`,
    "",
    "Project goals:",
    payload.message
  ].join("\n");
}

function toRequiredString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }

  return value.trim();
}

function toOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
