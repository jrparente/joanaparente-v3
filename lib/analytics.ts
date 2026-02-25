"use client";

import { sendGAEvent } from "@next/third-parties/google";

// ─── Conversion Events ─────────────────────────────────────────────

export function trackContactCtaClick(
  ctaLocation: string,
  pageLanguage: string
) {
  sendGAEvent("event", "contact_cta_click", {
    cta_location: ctaLocation,
    page_language: pageLanguage,
  });
}

export function trackContactEmailClick(pageLanguage: string) {
  sendGAEvent("event", "contact_email_click", {
    page_language: pageLanguage,
  });
}

export function trackProjectView(projectSlug: string, pageLanguage: string) {
  sendGAEvent("event", "project_view", {
    project_slug: projectSlug,
    page_language: pageLanguage,
  });
}

// ─── Engagement Events ──────────────────────────────────────────────

export function trackPortfolioCardClick(
  projectSlug: string,
  cardPosition: number
) {
  sendGAEvent("event", "portfolio_card_click", {
    project_slug: projectSlug,
    card_position: cardPosition,
  });
}

export function trackExternalLinkClick(
  destinationUrl: string,
  linkType: string
) {
  sendGAEvent("event", "external_link_click", {
    destination_url: destinationUrl,
    link_type: linkType,
  });
}

// ─── Lead Magnet Events ──────────────────────────────────────────

export function trackLeadMagnetView(
  magnetId: string,
  pageLanguage: string
) {
  sendGAEvent("event", "lead_magnet_view", {
    magnet_id: magnetId,
    page_language: pageLanguage,
  });
}

export function trackLeadMagnetComplete(
  magnetId: string,
  pageLanguage: string
) {
  sendGAEvent("event", "lead_magnet_complete", {
    magnet_id: magnetId,
    page_language: pageLanguage,
  });
}

export function trackEmailCaptured(
  magnetId: string,
  pageLanguage: string
) {
  sendGAEvent("event", "email_captured", {
    magnet_id: magnetId,
    page_language: pageLanguage,
  });
}
