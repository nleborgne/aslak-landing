"use client";

import { Suspense, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { TrialForm } from "@/components/trial-dialog";

export default function CfFormPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {sent ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              Demande envoyée
            </h1>
            <p className="mt-2 max-w-[36ch] text-sm text-muted-foreground">
              Merci ! Nous vous recontactons rapidement pour planifier votre
              séance d&rsquo;essai gratuite.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Rejoignez CrossFit ASLAK
              </h1>
              <p className="text-sm text-muted-foreground">
                Remplissez le formulaire pour être recontacté
              </p>
            </div>

            <Suspense fallback={<div className="min-h-96" />}>
              <TrialForm onSuccess={() => setSent(true)} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
