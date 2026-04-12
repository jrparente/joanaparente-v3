import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const contactForm = defineType({
  name: "contactForm",
  title: "Contact Form",
  icon: EnvelopeIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "heading",
      title: "Form Heading",
      type: "string",
      description: 'e.g. "Tell me about your project"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading (optional)",
      type: "string",
      description:
        'One line below the heading. e.g. "I reply within 24 hours on business days."',
    }),
    defineField({
      name: "submitLabel",
      title: "Submit Button Label",
      type: "string",
      description: 'e.g. "Send my brief"',
      initialValue: "Send my brief",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Shown after successful submission. Thank the visitor and set response time expectations.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameFieldLabel",
      title: "Name field label",
      type: "string",
      initialValue: "Full name",
    }),
    defineField({
      name: "emailFieldLabel",
      title: "Email field label",
      type: "string",
      initialValue: "Email",
    }),
    defineField({
      name: "companyFieldLabel",
      title: "Company field label",
      type: "string",
      initialValue: "Company / Brand (optional)",
    }),
    defineField({
      name: "projectTypeFieldLabel",
      title: "Project type label",
      type: "string",
      initialValue: "Type of project",
    }),
    defineField({
      name: "projectTypeOptions",
      title: "Project type options",
      type: "array",
      of: [{ type: "string" }],
      description: "Dropdown options for project type. Order matters.",
    }),
    defineField({
      name: "budgetRangeFieldLabel",
      title: "Budget range label",
      type: "string",
      initialValue: "Budget range",
    }),
    defineField({
      name: "budgetRangeOptions",
      title: "Budget range options",
      type: "array",
      of: [{ type: "string" }],
      description: "Dropdown options for budget. Order matters.",
    }),
    defineField({
      name: "timelineFieldLabel",
      title: "Timeline field label",
      type: "string",
      initialValue: "Timeline (optional)",
    }),
    defineField({
      name: "timelineOptions",
      title: "Timeline options",
      type: "array",
      of: [{ type: "string" }],
      description: "Dropdown options for timeline. Order matters.",
    }),
    defineField({
      name: "messageFieldLabel",
      title: "Message field label",
      type: "string",
      initialValue: "Your project",
    }),
    defineField({
      name: "messageFieldPlaceholder",
      title: "Message placeholder",
      type: "string",
      initialValue:
        "Tell me about your project. What problem are you solving?",
    }),
    defineField({
      name: "languagePreferenceLabel",
      title: "Language preference label",
      type: "string",
      initialValue: "Preferred language",
    }),
    defineField({
      name: "selectPlaceholder",
      title: "Select placeholder",
      type: "string",
      description: 'Placeholder text for dropdown fields. e.g. "Select one"',
      initialValue: "Select one",
    }),
    defineField({
      name: "submittingLabel",
      title: "Submitting label",
      type: "string",
      description: 'Text shown while the form is sending. e.g. "Sending…"',
      initialValue: "Sending…",
    }),
    defineField({
      name: "consentText",
      title: "Consent checkbox text",
      type: "string",
      description:
        'Text before the privacy policy link. e.g. "I consent to the processing of my data per the"',
      initialValue:
        "I consent to the processing of my personal data in accordance with the",
    }),
    defineField({
      name: "privacyPolicyLink",
      title: "Privacy Policy link",
      type: "link",
      description:
        "Link to the Privacy Policy page. The label is appended after the consent text.",
    }),
    defineField({
      name: "validationMessages",
      title: "Validation Messages",
      type: "object",
      description: "Error messages shown on invalid form submissions.",
      fields: [
        defineField({
          name: "required",
          title: "Required fields error",
          type: "string",
          initialValue: "Please fill in all required fields.",
        }),
        defineField({
          name: "minLength",
          title: "Min length error",
          type: "string",
          initialValue:
            "Please provide more detail about your project (at least 50 characters).",
        }),
        defineField({
          name: "invalidEmail",
          title: "Invalid email error",
          type: "string",
          initialValue: "Please enter a valid email address.",
        }),
        defineField({
          name: "submitError",
          title: "Submit error",
          type: "string",
          initialValue:
            "Something went wrong. Please try again or email hello@joanaparente.com directly.",
        }),
        defineField({
          name: "consentRequired",
          title: "Consent required error",
          type: "string",
          initialValue:
            "Please accept the privacy policy to submit the form.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", visible: "visible" },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Contact Form: ${title}`,
        media: EnvelopeIcon,
      };
    },
  },
});
