import { NextResponse } from "next/server";
import { buildContactEmailText, normalizeContactPayload } from "@/lib/contact";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

export async function POST(request: Request) {
  try {
    const payload = normalizeContactPayload(await request.json());

    if (!resendApiKey || !contactFromEmail || !contactToEmail) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured yet. Add RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL in your environment settings."
        },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        reply_to: payload.email,
        subject: `New Revibe inquiry from ${payload.firstName} ${payload.lastName}`.trim(),
        text: buildContactEmailText(payload)
      })
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      return NextResponse.json(
        {
          error: result?.message || "The email provider rejected the message."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong while sending the message."
      },
      { status: 400 }
    );
  }
}
