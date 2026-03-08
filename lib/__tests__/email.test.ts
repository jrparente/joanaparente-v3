const mockSend = vi.fn();

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = { send: mockSend };
    },
  };
});

describe("sendTransactionalEmail", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv, RESEND_API_KEY: "re_test_key" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function loadModule() {
    const mod = await import("../email");
    return mod.sendTransactionalEmail;
  }

  it("returns error when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const sendTransactionalEmail = await loadModule();
    const result = await sendTransactionalEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Email service not configured");
  });

  it("returns success with id on successful send", async () => {
    mockSend.mockResolvedValue({
      data: { id: "msg_abc" },
      error: null,
    });
    const sendTransactionalEmail = await loadModule();
    const result = await sendTransactionalEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });
    expect(result.success).toBe(true);
    expect(result.id).toBe("msg_abc");
  });

  it("returns error when Resend SDK returns an error object", async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: "Domain not verified", name: "validation_error" },
    });
    const sendTransactionalEmail = await loadModule();
    const result = await sendTransactionalEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Domain not verified");
  });

  it("returns error when SDK throws an exception", async () => {
    mockSend.mockRejectedValue(new Error("Network timeout"));
    const sendTransactionalEmail = await loadModule();
    const result = await sendTransactionalEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network timeout");
  });

  it("passes default from and replyTo values", async () => {
    mockSend.mockResolvedValue({ data: { id: "msg_def" }, error: null });
    const sendTransactionalEmail = await loadModule();
    await sendTransactionalEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Joana Parente <noreply@joanaparente.com>",
        replyTo: "hello@joanaparente.com",
      })
    );
  });

  it("maps attachment contentType to content_type", async () => {
    mockSend.mockResolvedValue({ data: { id: "msg_ghi" }, error: null });
    const sendTransactionalEmail = await loadModule();
    await sendTransactionalEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
      attachments: [
        {
          filename: "report.pdf",
          content: Buffer.from("pdf-content"),
          contentType: "application/pdf",
        },
      ],
    });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: [
          {
            filename: "report.pdf",
            content: Buffer.from("pdf-content"),
            content_type: "application/pdf",
          },
        ],
      })
    );
  });
});
