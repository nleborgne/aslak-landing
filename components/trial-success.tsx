"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

const TITLE = "Demande envoyée";
const DESCRIPTION =
  "Merci ! Nous vous recontactons rapidement pour planifier votre séance d’essai gratuite.";

export function TrialSuccess({
  variant,
  onClose,
}: {
  variant: "page" | "dialog";
  onClose?: () => void;
}) {
  if (variant === "dialog") {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <DialogTitle className="mt-4">{TITLE}</DialogTitle>
        <DialogDescription className="mt-2 max-w-[36ch]">
          {DESCRIPTION}
        </DialogDescription>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle2 className="size-12 text-primary" />
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{TITLE}</h1>
      <p className="mt-2 max-w-[36ch] text-sm text-muted-foreground">
        {DESCRIPTION}
      </p>
    </div>
  );
}
