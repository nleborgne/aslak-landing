"use server";

import { Resend, type CreateEmailRequestOptions } from "resend";
import { trialRequestSchema, type TrialRequest } from "@/lib/trial-request";

export async function sendTrialRequest(
  input: TrialRequest
): Promise<
  | { ok: false }
  | { ok: true; conversionTransactionId: string | null }
> {
  const parsed = trialRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }

  const { name, email, phone, interest, company } = parsed.data;

  if (company) {
    // Keep the anti-spam response indistinguishable in the UI, but never count it.
    return { ok: true, conversionTransactionId: null };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return { ok: false };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from:
        process.env.TRIAL_REQUEST_FROM ??
        "CrossFit ASLAK <onboarding@resend.dev>",
      to: process.env.TRIAL_REQUEST_TO ?? "contact@crossfitaslak.com",
      replyTo: email,
      subject: `Nouvelle demande de séance d'essai — ${name}`,
      text: [
        "Nouvelle demande de séance d'essai gratuite",
        "",
        `Nom : ${name}`,
        `Email : ${email}`,
        `Téléphone : ${phone}`,
        `Intérêt : ${interest === "hyrox" ? "Hyrox" : "CrossFit"}`,
        "",
        "Envoyée depuis crossfitaslak.com",
      ].join("\n"),
    },
    // Resend applies no default timeout; its option types don't declare
    // `signal` but it forwards request options to native fetch.
    { signal: AbortSignal.timeout(15_000) } as unknown as CreateEmailRequestOptions
  );

  if (error) {
    console.error("Resend error:", error);
    return { ok: false };
  }

  return { ok: true, conversionTransactionId: crypto.randomUUID() };
}
