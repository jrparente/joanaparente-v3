import { i18n } from "@/i18n.config";
import {
  HomeIcon,
  CogIcon,
  MenuIcon,
  BillIcon,
  BasketIcon,
  DocumentsIcon,
  ComposeIcon,
  PackageIcon,
  ControlsIcon,
  UserIcon,
} from "@sanity/icons";
import { FileText, FolderCode, Layers, PenBox, StickyNote } from "lucide-react";

export const structure = (S: any) =>
  S.list()
    .title("Website Content")
    .items([
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.listItem()
        .title("Website Pages")
        .icon(Layers)
        .child(
          S.list()
            .title("Page Versions")
            .items([
              ...i18n.languages.map((language: any) =>
                S.listItem()
                  .title(`Pages (${language.id.toLocaleUpperCase()})`)
                  .schemaType("page")
                  .icon(StickyNote)
                  .child(
                    S.documentList()
                      .apiVersion("v2023-12-18")
                      .id(language.id)
                      .title(`${language.title} Pages`)
                      .schemaType("page")
                      .filter('_type == "page" && language == $language')
                      .params({ type: "page", language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("page", {
                          _type: "page",
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName: any, params: any) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === "edit") {
                          // return params?.language === language.id
                          return false;
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true;
                        }

                        // Template name structure example: "lesson-en"
                        const languageValue = params?.template
                          ?.split(`-`)
                          .pop();

                        return languageValue === language.id;
                      })
                  )
              ),
              S.listItem()
                .title("Pages (No Language)")
                .schemaType("page")
                .icon(StickyNote)
                .child(
                  S.documentList()
                    .title("Pages (No Language)")
                    .schemaType("page")
                    .filter(
                      '_type == "page" && (!defined(language) || language == null)'
                    )
                ),
            ])
        ),

      S.listItem()
        .title("Blog Posts")
        .icon(PenBox)
        .child(
          S.list()
            .title("Blog Post Versions")
            .items([
              ...i18n.languages.map((language: any) =>
                S.listItem()
                  .title(`Blog Posts (${language.id.toLocaleUpperCase()})`)
                  .schemaType("blogPost")
                  .icon(FileText)
                  .child(
                    S.documentList()
                      .apiVersion("v2023-12-18")
                      .id(language.id)
                      .title(`${language.title} Blog Posts`)
                      .schemaType("blogPost")
                      .filter('_type == "blogPost" && language == $language')
                      .params({ type: "blogPost", language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("blogPost", {
                          _type: "blogPost",
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName: any, params: any) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === "edit") {
                          // return params?.language === language.id
                          return false;
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true;
                        }

                        // Template name structure example: "lesson-en"
                        const languageValue = params?.template
                          ?.split(`-`)
                          .pop();

                        return languageValue === language.id;
                      })
                  )
              ),
            ])
        ),

      S.listItem()
        .title("Projects")
        .icon(FolderCode)
        .child(
          S.list()
            .title("Project Versions")
            .items([
              ...i18n.languages.map((language: any) =>
                S.listItem()
                  .title(`Projects (${language.id.toLocaleUpperCase()})`)
                  .schemaType("project")
                  .icon(StickyNote)
                  .child(
                    S.documentList()
                      .apiVersion("v2023-12-18")
                      .id(language.id)
                      .title(`${language.title} Projects`)
                      .schemaType("project")
                      .filter('_type == "project" && language == $language')
                      .params({ type: "project", language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("project", {
                          _type: "project",
                          language: language.id,
                        }),
                      ])
                      .canHandleIntent((intentName: any, params: any) => {
                        // TODO: Handle **existing** documents (like search results when clicked)
                        // to return `true` on the correct language list!
                        if (intentName === "edit") {
                          // return params?.language === language.id
                          return false;
                        }

                        // Not an initial value template
                        if (!params.template) {
                          return true;
                        }

                        // Template name structure example: "lesson-en"
                        const languageValue = params?.template
                          ?.split(`-`)
                          .pop();

                        return languageValue === language.id;
                      })
                  )
              ),
            ])
        ),

      S.listItem()
        .title("Card Page (/card)")
        .icon(UserIcon)
        .child(
          S.list()
            .title("Card Page Versions")
            .items([
              ...i18n.languages.map((language: any) =>
                S.listItem()
                  .title(`Card Page (${language.id.toLocaleUpperCase()})`)
                  .schemaType("cardPage")
                  .icon(UserIcon)
                  .child(
                    S.documentList()
                      .apiVersion("v2023-12-18")
                      .id(`cardPage-${language.id}`)
                      .title(`${language.title} Card Page`)
                      .schemaType("cardPage")
                      .filter('_type == "cardPage" && language == $language')
                      .params({ type: "cardPage", language: language.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("cardPage", {
                          _type: "cardPage",
                          language: language.id,
                        }),
                      ])
                  )
              ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Navigation")
        .icon(MenuIcon)
        .child(S.document().schemaType("navigation").documentId("navigation")),

      S.listItem()
        .title("Footer")
        .icon(MenuIcon)
        .child(S.document().schemaType("footer").documentId("footer")),

      S.listItem()
        .title("Cookie Banner")
        .icon(ControlsIcon)
        .child(
          S.document().schemaType("cookieBanner").documentId("cookieBanner")
        ),

      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("site").documentId("site")),
    ]);
