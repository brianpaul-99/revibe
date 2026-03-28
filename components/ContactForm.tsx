"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactForm.module.css";

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
    const form = event.currentTarget;

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || "The form service rejected the request.");
      }

      setStatus("success");
      setFormState(initialState);
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while sending your message.";

      setStatus("error");
      setErrorMessage(message);
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
      <div className={styles.footer}>
        <button className={styles.submit} type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send inquiry"}
        </button>

        <p className={styles.helpText}>
          The form submits to this app&apos;s backend route. No contact email is exposed in the client.
        </p>
      </div>

      {status === "success" ? <p className={styles.success}>Thanks. Your message is on its way.</p> : null}
      {status === "error" ? <p className={styles.error}>{errorMessage}</p> : null}
    </form>
  );
}
