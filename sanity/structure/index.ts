import {
  HomeIcon,
  CogIcon,
  MenuIcon,
  BillIcon,
  BasketIcon,
  DocumentsIcon,
  ComposeIcon,
  PackageIcon,
} from "@sanity/icons";

export const structure = (S: any) =>
  S.list()
    .title("Website Content")
    .items([
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .filter('_type == "page"')
            .initialValueTemplates([S.initialValueTemplateItem("page")])
        ),

      S.listItem()
        .title("Stories")
        .icon(ComposeIcon)
        .child(
          S.documentTypeList("blogPost")
            .title("Stories")
            .filter('_type == "blogPost"')
            .initialValueTemplates([S.initialValueTemplateItem("blogPost")])
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
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
        .title("Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("site").documentId("site")),
    ]);
