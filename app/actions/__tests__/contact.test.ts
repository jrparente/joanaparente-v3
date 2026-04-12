import { submitContactForm } from "../contact";

vi.mock("@/lib/email", () => ({
  sendTransactionalEmail: vi.fn(),
}));

import { sendTransactionalEmail } from "@/lib/email";
const mockSendEmail = vi.mocked(sendTransactionalEmail);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

const validFields = {
  name: "Test User",
  email: "test@example.com",
  projectType: "Website",
  budgetRange: "5000-10000",
  message:
    "I need a new portfolio website with modern design and great performance.",
  consent: "on",
};

const prevState = { success: false };

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("rejects missing name", async () => {
      const { name, ...rest } = validFields;
      const result = await submitContactForm(prevState, makeFormData(rest));
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/required fields/);
    });

    it("rejects missing email", async () => {
      const { email, ...rest } = validFields;
      const result = await submitContactForm(prevState, makeFormData(rest));
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/required fields/);
    });

    it("rejects missing projectType", async () => {
      const { projectType, ...rest } = validFields;
      const result = await submitContactForm(prevState, makeFormData(rest));
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/required fields/);
    });

    it("rejects missing budgetRange", async () => {
      const { budgetRange, ...rest } = validFields;
      const result = await submitContactForm(prevState, makeFormData(rest));
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/required fields/);
    });

    it("rejects missing message", async () => {
      const { message, ...rest } = validFields;
      const result = await submitContactForm(prevState, makeFormData(rest));
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/required fields/);
    });

    it("rejects invalid email format", async () => {
      const result = await submitContactForm(
        prevState,
        makeFormData({ ...validFields, email: "not-an-email" })
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/valid email/);
    });

    it("rejects message shorter than 50 characters", async () => {
      const result = await submitContactForm(
        prevState,
        makeFormData({ ...validFields, message: "Too short." })
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/at least 50 characters/);
    });

    it("rejects missing consent", async () => {
      const { consent, ...rest } = validFields;
      const result = await submitContactForm(prevState, makeFormData(rest));
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/privacy policy/i);
    });
  });

  describe("submission", () => {
    it("returns success when email sends successfully", async () => {
      mockSendEmail.mockResolvedValue({ success: true, id: "msg_123" });
      const result = await submitContactForm(
        prevState,
        makeFormData(validFields)
      );
      expect(result.success).toBe(true);
      expect(mockSendEmail).toHaveBeenCalledOnce();
    });

    it("returns error when email service fails", async () => {
      mockSendEmail.mockResolvedValue({
        success: false,
        error: "Service down",
      });
      const result = await submitContactForm(
        prevState,
        makeFormData(validFields)
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/try again/);
    });

    it("returns error when exception is thrown", async () => {
      mockSendEmail.mockRejectedValue(new Error("Network error"));
      const result = await submitContactForm(
        prevState,
        makeFormData(validFields)
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/try again/);
    });

    it("works with optional fields set to empty", async () => {
      mockSendEmail.mockResolvedValue({ success: true, id: "msg_456" });
      const result = await submitContactForm(
        prevState,
        makeFormData(validFields)
      );
      expect(result.success).toBe(true);
    });

    it("passes HTML-escaped content to sendTransactionalEmail", async () => {
      mockSendEmail.mockResolvedValue({ success: true, id: "msg_789" });
      await submitContactForm(
        prevState,
        makeFormData({
          ...validFields,
          name: '<script>alert("xss")</script>',
          message:
            "This is a message with <b>HTML</b> tags & special \"characters\" that should be escaped properly for safety.",
        })
      );
      const html = mockSendEmail.mock.calls[0][0].html;
      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain("&amp;");
      expect(html).toContain("&quot;");
      expect(html).not.toContain("<script>");
    });
  });
});
