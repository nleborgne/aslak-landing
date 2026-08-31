"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { sendTrialRequest } from "@/app/actions/trial-request";
import { trialRequestSchema, type TrialRequest } from "@/lib/trial-request";
import { useHomeType } from "@/components/home-content";
import { TrialSuccess } from "@/components/trial-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = digits.match(/.{1,2}/g);
  return parts ? parts.join(" ") : digits;
}

export function TrialForm({
  onSuccess,
}: {
  onSuccess?: (conversionTransactionId: string | null) => void;
}) {
  const [type] = useHomeType();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const form = useForm<TrialRequest>({
    resolver: zodResolver(trialRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: type,
      company: "",
    },
  });

  async function onSubmit(data: TrialRequest) {
    setStatus("sending");
    try {
      const result = await sendTrialRequest({ ...data, interest: type });
      if (result.ok) {
        onSuccess?.(result.conversionTransactionId);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jean@exemple.fr"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="06 12 34 56 78"
                  autoComplete="tel-national"
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatPhone(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot anti-spam */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...form.register("company")}
        />

        {status === "error" && (
          <p className="text-sm text-destructive" role="alert">
            L&rsquo;envoi a échoué. Réessayez ou écrivez-nous à{" "}
            <a href="mailto:contact@crossfitaslak.com" className="underline">
              contact@crossfitaslak.com
            </a>
            .
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <Loader2 className="animate-spin" />
              Envoi en cours…
            </>
          ) : (
            "Réserver ma séance d'essai"
          )}
        </Button>
      </form>
    </Form>
  );
}

export function TrialDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [submission, setSubmission] = useState<{
    conversionTransactionId: string | null;
  } | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setSubmission(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        {submission ? (
          <TrialSuccess
            variant="dialog"
            conversionTransactionId={submission.conversionTransactionId}
            onClose={() => setOpen(false)}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Réserver une séance d&rsquo;essai</DialogTitle>
              <DialogDescription>
                Première séance gratuite. Laissez vos coordonnées et nous vous
                recontactons pour fixer un créneau.
              </DialogDescription>
            </DialogHeader>
            <TrialForm
              onSuccess={(conversionTransactionId) =>
                setSubmission({ conversionTransactionId })
              }
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
