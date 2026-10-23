"use client";

import { Suspense, useState } from "react";
import { CookieSettingsLink } from "@/components/cookie-consent";
import { TrialForm } from "@/components/trial-dialog";
import { TrialSuccess } from "@/components/trial-success";

export default function CfFormPage() {
  const [submission, setSubmission] = useState<{
    conversionTransactionId: string | null;
  } | null>(null);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {submission ? (
          <TrialSuccess
            variant="page"
            conversionTransactionId={submission.conversionTransactionId}
          />
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
              <TrialForm
                onSuccess={(conversionTransactionId) =>
                  setSubmission({ conversionTransactionId })
                }
              />
            </Suspense>
          </>
        )}

        <div className="text-center">
          <CookieSettingsLink
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          />
        </div>
      </div>
    </div>
  );
}
