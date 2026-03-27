"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactForm.module.css";

const endpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;
const fallbackEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@revibe.ca";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  message: ""
};

export default function ContactForm() {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!endpoint) {
      const subject = encodeURIComponent(`New Revibe inquiry from ${formState.firstName} ${formState.lastName}`.trim());
      const body = encodeURIComponent(
        [
          `Name: ${formState.firstName} ${formState.lastName}`.trim(),
          `Email: ${formState.email}`,
          `Phone: ${formState.phone || "Not provided"}`,
          `Company: ${formState.company || "Not provided"}`,
          "",
          formState.message
        ].join("\n")
      );

      window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new FormData(event.currentTarget)
      });

      if (!response.ok) {
        throw new Error("The form service rejected the request.");
      }

      setStatus("success");
      setFormState(initialState);
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong while sending your message.");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>First Name</span>
          <input
            name="firstName"
            type="text"
            placeholder="Alex"
            required
            value={formState.firstName}
            onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span>Last Name</span>
          <input
            name="lastName"
            type="text"
            placeholder="Morgan"
            required
            value={formState.lastName}
            onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="alex@company.com"
            required
            value={formState.email}
            onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span>Contact Number</span>
          <input
            name="phone"
            type="tel"
            placeholder="(416) 555-0123"
            value={formState.phone}
            onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Company</span>
        <input
          name="company"
          type="text"
          placeholder="Your business name"
          value={formState.company}
          onChange={(event) => setFormState((current) => ({ ...current, company: event.target.value }))}
        />
      </label>

      <label className={styles.field}>
        <span>Project Goals</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us what you're trying to grow, what isn't working, and the kind of support you need."
          required
          value={formState.message}
          onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
        />
      </label>

      <input type="hidden" name="_subject" value="New Revibe website inquiry" />

      <div className={styles.footer}>
        <button className={styles.submit} type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send inquiry"}
        </button>

        <p className={styles.helpText}>
          {endpoint
            ? "This form is wired for your hosted email service."
            : `No email endpoint is configured yet, so this will open your mail app to ${fallbackEmail}.`}
        </p>
      </div>

      {status === "success" ? <p className={styles.success}>Thanks. Your message is on its way.</p> : null}
      {status === "error" ? <p className={styles.error}>{errorMessage}</p> : null}
    </form>
  );
}
