"use server";

import { sendTransactionalEmail } from "@/lib/email";

export interface ContactFormState {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string | null;
  const projectType = formData.get("projectType") as string;
  const budgetRange = formData.get("budgetRange") as string;
  const message = formData.get("message") as string;
  const languagePreference = formData.get("languagePreference") as string | null;

  // Validation
  if (!name || !email || !projectType || !budgetRange || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (message.length < 50) {
    return {
      success: false,
      error: "Please provide more detail about your project (at least 50 characters).",
    };
  }

  const html = `
    <h2>New Project Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
    <p><strong>Budget Range:</strong> ${escapeHtml(budgetRange)}</p>
    ${languagePreference ? `<p><strong>Language Preference:</strong> ${escapeHtml(languagePreference)}</p>` : ""}
    <hr />
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message)}</p>
  `;

  try {
    const result = await sendTransactionalEmail({
      to: "hello@joanaparente.com",
      subject: `New project inquiry from ${name} — ${projectType}`,
      html,
      replyTo: email,
    });

    if (!result.success) {
      return {
        success: false,
        error: "Something went wrong. Please try again or email hello@joanaparente.com directly.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again or email hello@joanaparente.com directly.",
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
