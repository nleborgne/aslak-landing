import { z } from "zod";

const phoneRegex = /^0[67]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;

export const trialRequestSchema = z.object({
  name: z.string().min(2, "Veuillez entrer votre nom"),
  email: z.string().email("Veuillez entrer un email valide"),
  phone: z.string().regex(phoneRegex, "Numéro invalide (ex: 06 12 34 56 78)"),
  interest: z.enum(["crossfit", "hyrox"]),
  // Honeypot — jamais rempli par un humain
  company: z.string().optional(),
});

export type TrialRequest = z.infer<typeof trialRequestSchema>;
