import { NextRequest, NextResponse } from "next/server";

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_BASE = "https://connect.mailerlite.com/api";

export async function POST(request: NextRequest) {
  try {
    const { email, magnetId, language, firstName } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!MAILERLITE_API_KEY) {
      console.error("MAILERLITE_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    // Build subscriber payload
    const subscriberPayload: Record<string, unknown> = {
      email,
      fields: {
        language: language || "pt",
        lead_magnet: magnetId || "general",
      },
    };

    if (firstName) {
      subscriberPayload.fields = {
        ...(subscriberPayload.fields as Record<string, string>),
        name: firstName,
      };
    }

    // Add to group if configured for this magnet
    const groupId = getGroupId(magnetId);
    if (groupId) {
      subscriberPayload.groups = [groupId];
    }

    const response = await fetch(`${MAILERLITE_BASE}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(subscriberPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Mailerlite API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Map magnet IDs to Mailerlite group IDs.
 * Set these via environment variables.
 */
function getGroupId(magnetId?: string): string | undefined {
  if (!magnetId) return process.env.MAILERLITE_GROUP_GENERAL;

  const groupMap: Record<string, string | undefined> = {
    "hiring-checklist": process.env.MAILERLITE_GROUP_HIRING_CHECKLIST,
    "roi-calculator": process.env.MAILERLITE_GROUP_ROI_CALCULATOR,
    "performance-assessment": process.env.MAILERLITE_GROUP_PERFORMANCE_ASSESSMENT,
    general: process.env.MAILERLITE_GROUP_GENERAL,
  };

  return groupMap[magnetId] || process.env.MAILERLITE_GROUP_GENERAL;
}
