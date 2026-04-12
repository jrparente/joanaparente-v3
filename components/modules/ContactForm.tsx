"use client";

import {
  useActionState,
  useState,
  useRef,
  useEffect,
  useId,
  useCallback,
} from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/actions/contact";
import { trackContactFormSubmit } from "@/lib/analytics";
import { RichText } from "@/components/portabletext/RichText";
import { resolveLink } from "@/lib/utils";
import type { ContactFormBlock } from "@/types/Sanity";

type Props = {
  block: ContactFormBlock;
  language?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ block, language }: Props) {
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;
  const errorId = (name: string) => `${id}-${name}-error`;

  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
  });

  // Handle success
  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      // Fire GA4 event
      const form = formRef.current;
      if (form) {
        const fd = new FormData(form);
        trackContactFormSubmit(
          (fd.get("projectType") as string) || "",
          (fd.get("budgetRange") as string) || "",
          language || "pt"
        );
      }
    }
  }, [state.success, language]);

  // Focus success message for screen readers
  useEffect(() => {
    if (showSuccess && successRef.current) {
      successRef.current.focus();
    }
  }, [showSuccess]);

  // --- Validation helpers ---

  const msg = block.validationMessages;

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case "name":
          if (!value.trim())
            return msg?.required || "This field is required.";
          break;
        case "email":
          if (!value.trim())
            return msg?.required || "This field is required.";
          if (!EMAIL_REGEX.test(value))
            return msg?.invalidEmail || "Please enter a valid email address.";
          break;
        case "projectType":
        case "budgetRange":
          if (!value)
            return msg?.required || "This field is required.";
          break;
        case "message":
          if (!value.trim())
            return msg?.required || "This field is required.";
          if (value.trim().length < 50)
            return (
              msg?.minLength ||
              "Please provide more detail (at least 50 characters)."
            );
          break;
        case "consent":
          if (value !== "on")
            return (
              msg?.consentRequired ||
              "Please accept the privacy policy to submit the form."
            );
          break;
      }
      return undefined;
    },
    [msg]
  );

  function validateAll(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    const required = ["name", "email", "projectType", "budgetRange", "message"];
    for (const field of required) {
      const val = (formData.get(field) as string) || "";
      const err = validateField(field, val);
      if (err) errs[field] = err;
    }
    // Checkbox: value is "on" when checked, null when unchecked
    const consentVal = formData.get("consent") as string | null;
    const consentErr = validateField("consent", consentVal || "");
    if (consentErr) errs.consent = consentErr;
    return errs;
  }

  // Client-side validation in onSubmit — prevents form reset on error
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(e.currentTarget);
      const clientErrors = validateAll(formData);
      if (Object.keys(clientErrors).length > 0) {
        e.preventDefault();
        setErrors(clientErrors);
        // Focus first errored field
        const firstErrorField = Object.keys(clientErrors)[0];
        const el = e.currentTarget.elements.namedItem(firstErrorField);
        if (el instanceof HTMLElement) el.focus();
        return;
      }
      setErrors({});
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const err = validateField(name, value);
      setErrors((prev) => {
        if (err) return { ...prev, [name]: err };
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [validateField]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [errors]
  );

  // --- Success state ---
  if (showSuccess) {
    return (
      <section className="relative z-1 py-12 sm:py-20">
        <div className="mx-auto max-w-[720px] px-5 sm:px-8">
          <div
            ref={successRef}
            tabIndex={-1}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 sm:p-12 text-center outline-none"
            role="status"
            aria-live="polite"
          >
            {/* Check icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-light)]">
              <svg
                className="h-8 w-8 text-[var(--color-accent)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="prose prose-base mx-auto max-w-md">
              <RichText value={block.successMessage} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Form rendering ---

  const serverError =
    state.error && state.error !== "validation"
      ? state.error
      : null;

  return (
    <section className="relative z-1 py-12 sm:py-20">
      <div className="mx-auto max-w-[720px] px-5 sm:px-8">
        {/* Form header */}
        <div className="mb-8 sm:mb-10">
          <h2
            className="font-heading text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)]"
            style={{ fontVariationSettings: "'WONK' 0" }}
          >
            {block.heading}
          </h2>
          {block.subheading && (
            <p className="mt-2 text-base text-[var(--color-text-muted)] leading-relaxed">
              {block.subheading}
            </p>
          )}
        </div>

        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="rounded-[var(--radius-md)] border border-destructive/40 bg-destructive/8 px-4 py-3 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FieldGroup
              label={block.nameFieldLabel || "Full name"}
              htmlFor={fieldId("name")}
              error={errors.name}
              errorId={errorId("name")}
            >
              <input
                type="text"
                id={fieldId("name")}
                name="name"
                autoComplete="name"
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? errorId("name") : undefined}
                onBlur={handleBlur}
                onChange={handleChange}
                className={inputClasses(!!errors.name)}
              />
            </FieldGroup>

            <FieldGroup
              label={block.emailFieldLabel || "Email"}
              htmlFor={fieldId("email")}
              error={errors.email}
              errorId={errorId("email")}
            >
              <input
                type="email"
                id={fieldId("email")}
                name="email"
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? errorId("email") : undefined}
                onBlur={handleBlur}
                onChange={handleChange}
                className={inputClasses(!!errors.email)}
              />
            </FieldGroup>
          </div>

          {/* Row 2: Company (full width) */}
          <FieldGroup
            label={block.companyFieldLabel || "Company / Brand (optional)"}
            htmlFor={fieldId("company")}
          >
            <input
              type="text"
              id={fieldId("company")}
              name="company"
              autoComplete="organization"
              className={inputClasses(false)}
            />
          </FieldGroup>

          {/* Row 3: Project type + Budget + Timeline */}
          <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-3">
            <FieldGroup
              label={block.projectTypeFieldLabel || "Type of project"}
              htmlFor={fieldId("projectType")}
              error={errors.projectType}
              errorId={errorId("projectType")}
            >
              <SelectField
                id={fieldId("projectType")}
                name="projectType"
                options={block.projectTypeOptions}
                placeholder={block.selectPlaceholder || (language === "pt" ? "Seleciona uma opção" : "Select one")}
                required
                hasError={!!errors.projectType}
                errorId={errors.projectType ? errorId("projectType") : undefined}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup
              label={block.budgetRangeFieldLabel || "Budget range"}
              htmlFor={fieldId("budgetRange")}
              error={errors.budgetRange}
              errorId={errorId("budgetRange")}
            >
              <SelectField
                id={fieldId("budgetRange")}
                name="budgetRange"
                options={block.budgetRangeOptions}
                placeholder={block.selectPlaceholder || (language === "pt" ? "Seleciona uma opção" : "Select one")}
                required
                hasError={!!errors.budgetRange}
                errorId={
                  errors.budgetRange ? errorId("budgetRange") : undefined
                }
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup
              label={block.timelineFieldLabel || "Timeline (optional)"}
              htmlFor={fieldId("timeline")}
            >
              <SelectField
                id={fieldId("timeline")}
                name="timeline"
                options={block.timelineOptions}
                placeholder={block.selectPlaceholder || (language === "pt" ? "Seleciona uma opção" : "Select one")}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FieldGroup>
          </div>

          {/* Row 4: Message textarea */}
          <FieldGroup
            label={block.messageFieldLabel || "Your project"}
            htmlFor={fieldId("message")}
            error={errors.message}
            errorId={errorId("message")}
          >
            <textarea
              id={fieldId("message")}
              name="message"
              required
              placeholder={
                block.messageFieldPlaceholder ||
                "Tell me about your project. What problem are you solving?"
              }
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? errorId("message") : undefined
              }
              onBlur={handleBlur}
              onChange={handleChange}
              className={`${inputClasses(!!errors.message)} min-h-[160px] resize-y leading-relaxed`}
            />
          </FieldGroup>

          {/* Row 5: Language preference radio */}
          <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
            <legend className="text-sm font-semibold text-[var(--color-text)] leading-snug">
              {block.languagePreferenceLabel || "Preferred language"}{" "}
              <span className="font-normal text-[var(--color-text-subtle)]">
                (optional)
              </span>
            </legend>
            <div className="flex gap-6 pt-1 max-[640px]:flex-col max-[640px]:gap-3">
              <label className="flex cursor-pointer items-center gap-2 min-h-[44px]">
                <input
                  type="radio"
                  name="languagePreference"
                  value="english"
                  defaultChecked={language === "en"}
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-colors checked:border-[var(--color-brand)] checked:bg-[var(--color-brand)] focus:outline-none focus:ring-3 focus:ring-[var(--color-brand-light)] focus:border-[var(--color-brand)]"
                />
                <span className="text-base text-[var(--color-text)] select-none">
                  English
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 min-h-[44px]">
                <input
                  type="radio"
                  name="languagePreference"
                  value="português"
                  defaultChecked={language === "pt"}
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-colors checked:border-[var(--color-brand)] checked:bg-[var(--color-brand)] focus:outline-none focus:ring-3 focus:ring-[var(--color-brand-light)] focus:border-[var(--color-brand)]"
                />
                <span className="text-base text-[var(--color-text)] select-none">
                  Português
                </span>
              </label>
            </div>
          </fieldset>

          {/* Row 6: GDPR consent checkbox */}
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-start gap-3 min-h-[44px]">
              <input
                type="checkbox"
                name="consent"
                required
                aria-invalid={!!errors.consent}
                aria-describedby={
                  errors.consent ? errorId("consent") : undefined
                }
                onChange={(e) => {
                  if (errors.consent && e.target.checked) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.consent;
                      return next;
                    });
                  }
                }}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] bg-center bg-no-repeat transition-colors checked:border-[var(--color-brand)] checked:bg-[var(--color-brand)] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2.5-2.5a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] focus:outline-none focus:ring-3 focus:ring-[var(--color-brand-light)] focus:border-[var(--color-brand)]"
              />
              <span className="text-sm leading-snug text-[var(--color-text-muted)] select-none">
                {block.consentText ||
                  "I consent to the processing of my personal data in accordance with the"}{" "}
                {block.privacyPolicyLink ? (
                  <a
                    href={resolveLink(block.privacyPolicyLink, language)}
                    target={
                      block.privacyPolicyLink.type === "external"
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      block.privacyPolicyLink.type === "external"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="font-medium text-[var(--color-brand)] underline underline-offset-2 hover:text-[var(--color-brand-dark)] transition-colors"
                  >
                    {block.privacyPolicyLink.label || "Privacy Policy"}
                  </a>
                ) : (
                  <span className="font-medium">
                    {language === "pt"
                      ? "Política de Privacidade"
                      : "Privacy Policy"}
                  </span>
                )}
                .
              </span>
            </label>
            {errors.consent && (
              <p
                id={errorId("consent")}
                className="text-sm text-destructive pl-8"
                role="alert"
              >
                {errors.consent}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-brand)] px-8 py-[0.9375rem] text-base font-semibold text-white transition-all hover:bg-[var(--color-brand-dark)] hover:-translate-y-px active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none focus:outline-none focus:ring-3 focus:ring-[var(--color-brand-light)]"
          >
            {isPending ? (
              <>
                <Spinner />
                <span>{block.submittingLabel || (language === "pt" ? "A enviar…" : "Sending…")}</span>
              </>
            ) : (
              <>
                <span>{block.submitLabel || "Send my brief"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638l-3.96-3.96a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06l3.96-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function inputClasses(hasError: boolean): string {
  return [
    "w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-elevated)] px-4 py-3",
    "text-base text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]",
    "outline-none transition-[border-color,box-shadow] duration-200",
    "focus:border-[var(--color-brand)] focus:ring-3 focus:ring-[var(--color-brand-light)]",
    hasError
      ? "border-destructive"
      : "border-[var(--color-border)]",
  ].join(" ");
}

function FieldGroup({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-[var(--color-text)] leading-snug"
      >
        {label}
      </label>
      {children}
      {error && errorId && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  name,
  options,
  placeholder = "Select one",
  required,
  hasError,
  errorId,
  onBlur,
  onChange,
}: {
  id: string;
  name: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  errorId?: string;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={hasError || undefined}
        aria-describedby={errorId}
        onBlur={onBlur}
        onChange={onChange}
        className={`${inputClasses(!!hasError)} cursor-pointer appearance-none pr-10`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <svg
          className="h-4 w-4 text-[var(--color-text-muted)]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
