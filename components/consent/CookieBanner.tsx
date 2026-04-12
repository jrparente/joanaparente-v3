"use client";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { useEffect } from "react";
import { resolveLink } from "@/lib/utils";
import { LinkType } from "@/types/Sanity";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

function updateGtagConsent() {
  if (typeof window.gtag !== "function") return;
  const analyticsAccepted = CookieConsent.acceptedCategory("analytics");
  window.gtag("consent", "update", {
    analytics_storage: analyticsAccepted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

interface CookieBannerProps {
  title: string;
  description: string;
  acceptLabel: string;
  rejectLabel: string;
  privacyPolicyLink?: LinkType;
  language: string;
}

export default function CookieBanner({
  title,
  description,
  acceptLabel,
  rejectLabel,
  privacyPolicyLink,
  language,
}: CookieBannerProps) {
  useEffect(() => {
    const privacyHref = privacyPolicyLink
      ? resolveLink(privacyPolicyLink, language)
      : `/${language}/privacy-policy`;
    const privacyLabel = privacyPolicyLink?.label || "Privacy Policy";
    const descriptionWithLink = `${description} <a href="${privacyHref}" aria-label="${privacyLabel}">${privacyLabel}</a>.`;

    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "cloud inline",
          position: "bottom center",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: "_gid" }],
          },
        },
      },
      language: {
        default: language,
        translations: {
          [language]: {
            consentModal: {
              title,
              description: descriptionWithLink,
              acceptAllBtn: acceptLabel,
              rejectAllBtn: rejectLabel,
            },
            preferencesModal: {
              title: language === "pt" ? "Preferências de cookies" : "Cookie preferences",
              savePreferencesBtn:
                language === "pt" ? "Guardar preferências" : "Save preferences",
              closeIconLabel: language === "pt" ? "Fechar" : "Close",
              sections: [
                {
                  title:
                    language === "pt"
                      ? "Cookies estritamente necessários"
                      : "Strictly necessary cookies",
                  description:
                    language === "pt"
                      ? "Estes cookies são necessários para o funcionamento do site e não podem ser desativados."
                      : "These cookies are necessary for the website to function and cannot be switched off.",
                  linkedCategory: "necessary",
                },
                {
                  title:
                    language === "pt" ? "Cookies de análise" : "Analytics cookies",
                  description:
                    language === "pt"
                      ? "Estes cookies permitem-nos contar visitas e fontes de tráfego para medir e melhorar o desempenho do site."
                      : "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
                  linkedCategory: "analytics",
                  cookieTable: {
                    caption:
                      language === "pt"
                        ? "Tabela de cookies"
                        : "Cookie table",
                    headers: {
                      name: language === "pt" ? "Nome" : "Name",
                      domain: language === "pt" ? "Domínio" : "Domain",
                      desc: language === "pt" ? "Descrição" : "Description",
                      duration: language === "pt" ? "Duração" : "Duration",
                    },
                    body: [
                      {
                        name: "_ga",
                        domain: location.hostname,
                        desc:
                          language === "pt"
                            ? "Cookie principal do Google Analytics"
                            : "Main Google Analytics cookie",
                        duration: language === "pt" ? "2 anos" : "2 years",
                      },
                      {
                        name: "_gid",
                        domain: location.hostname,
                        desc:
                          language === "pt"
                            ? "Cookie de sessão do Google Analytics"
                            : "Google Analytics session cookie",
                        duration: language === "pt" ? "24 horas" : "24 hours",
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
      onFirstConsent: () => {
        updateGtagConsent();
      },
      onConsent: () => {
        updateGtagConsent();
      },
      onChange: () => {
        updateGtagConsent();
      },
    });
  }, [title, description, acceptLabel, rejectLabel, privacyPolicyLink, language]);

  return null;
}
