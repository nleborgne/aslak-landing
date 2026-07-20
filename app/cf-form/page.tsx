"use client";

import { Suspense, useState } from "react";
import { TrialForm } from "@/components/trial-dialog";
import { TrialSuccess } from "@/components/trial-success";

export default function CfFormPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {sent ? (
          <TrialSuccess variant="page" />
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
