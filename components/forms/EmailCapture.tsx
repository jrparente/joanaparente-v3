"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { trackEmailCaptured } from "@/lib/analytics";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type EmailCaptureCopy = {
  heading?: string;
  description?: string;
  emailPlaceholder: string;
  namePlaceholder?: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  privacyNote?: string;
};

const defaultCopy: Record<string, EmailCaptureCopy> = {
  pt: {
    emailPlaceholder: "O seu email",
    namePlaceholder: "O seu nome (opcional)",
    submitLabel: "Subscrever",
    successMessage: "Obrigada! Verifique o seu email.",
    errorMessage: "Algo correu mal. Tente novamente.",
    privacyNote: "Sem spam. Pode cancelar a qualquer momento.",
  },
  en: {
    emailPlaceholder: "Your email",
    namePlaceholder: "Your name (optional)",
    submitLabel: "Subscribe",
    successMessage: "Thank you! Check your email.",
    errorMessage: "Something went wrong. Please try again.",
    privacyNote: "No spam. Unsubscribe anytime.",
  },
};

type Props = {
  magnetId: string;
  language: string;
  copy?: Partial<EmailCaptureCopy>;
  showName?: boolean;
  variant?: "inline" | "card";
  className?: string;
};

export function EmailCapture({
  magnetId,
  language,
  copy: customCopy,
  showName = false,
  variant = "card",
  className,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const lang = language === "pt" ? "pt" : "en";
  const copy = { ...defaultCopy[lang], ...customCopy };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          magnetId,
          language: lang,
        }),
      });

      if (!response.ok) throw new Error("Subscribe failed");

      setStatus("success");
      trackEmailCaptured(magnetId, lang);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent-light)] p-4 text-[var(--color-accent-dark)] ${className || ""}`}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{copy.successMessage}</p>
      </div>
    );
  }

  const isCard = variant === "card";

  return (
    <div
      className={`${isCard ? "rounded-lg border border-border bg-card p-6" : ""} ${className || ""}`}
    >
      {copy.heading && (
        <h3 className="text-lg font-semibold tracking-tight">
          {copy.heading}
        </h3>
      )}
      {copy.description && (
        <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${copy.heading || copy.description ? "mt-4" : ""} flex flex-col gap-3 sm:flex-row sm:items-end`}
      >
        {showName && (
          <div className="flex-1">
            <Label htmlFor={`name-${magnetId}`} className="sr-only">
              {copy.namePlaceholder}
            </Label>
            <Input
              id={`name-${magnetId}`}
              placeholder={copy.namePlaceholder}
              {...register("firstName")}
              disabled={status === "loading"}
            />
          </div>
        )}

        <div className="flex-1">
          <Label htmlFor={`email-${magnetId}`} className="sr-only">
            {copy.emailPlaceholder}
          </Label>
          <Input
            id={`email-${magnetId}`}
            type="email"
            placeholder={copy.emailPlaceholder}
            {...register("email")}
            disabled={status === "loading"}
            aria-invalid={!!errors.email}
          />
        </div>

        <Button type="submit" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          {copy.submitLabel}
        </Button>
      </form>

      {errors.email && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {lang === "pt" ? "Email inválido" : "Invalid email"}
        </p>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {copy.errorMessage}
        </p>
      )}

      {copy.privacyNote && (
        <p className="mt-2 text-xs text-muted-foreground">{copy.privacyNote}</p>
      )}
    </div>
  );
}
