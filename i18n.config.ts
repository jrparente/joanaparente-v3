const languages = [
  { id: "en", title: "English", locale: "en", isDefault: true },
  { id: "pt", title: "Português", locale: "pt" },
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

export { languages, defaultLanguage, i18n, googleTranslateLanguages };
