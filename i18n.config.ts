const languages = [
  { id: "pt", title: "Português", locale: "pt", isDefault: true },
  { id: "en", title: "English", locale: "en" },
];

const defaultLanguage = languages.find((item) => item.isDefault);

const i18n = {
  languages,
  base: defaultLanguage ? defaultLanguage.id : "en", // Provide a fallback value
};

const googleTranslateLanguages = languages.map(({ id, title }) => ({
  id,
  title,
}));

const pathTranslations: Record<string, Record<string, string>> = {
  pt: { projects: "projetos", contact: "contacto" },
  en: { projects: "projects", contact: "contact" },
};

export {
  languages,
  defaultLanguage,
  i18n,
  googleTranslateLanguages,
  pathTranslations,
};
