import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { useSettingsStore } from "#/store/settings.store";

type LangMap = Record<string, Record<string, unknown>>;

const moduleFiles = import.meta.glob<LangMap>(
  "../../modules/**/language.json",
  {
    eager: true,
    import: "default",
  },
);

const componentFiles = import.meta.glob<LangMap>(
  "../../components/**/language.json",
  { eager: true, import: "default" },
);

const libFiles = import.meta.glob<LangMap>("../../lib/**/language.json", {
  eager: true,
  import: "default",
});

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      target[key] = deepMerge(
        (target[key] as Record<string, unknown>) ?? {},
        val as Record<string, unknown>,
      );
    } else {
      target[key] = val;
    }
  }
  return target;
}

const merged: LangMap = {};

for (const file of [
  ...Object.values(moduleFiles),
  ...Object.values(componentFiles),
  ...Object.values(libFiles),
]) {
  for (const [lang, keys] of Object.entries(file)) {
    merged[lang] ??= {};
    deepMerge(merged[lang], keys);
  }
}

const resources = Object.fromEntries(
  Object.entries(merged).map(([lang, keys]) => [lang, { translation: keys }]),
);

i18next.use(initReactI18next).init({
  lng: useSettingsStore.getState().language,
  fallbackLng: "es",
  resources,
  interpolation: { escapeValue: false },
});

useSettingsStore.subscribe(
  (state) => state.language,
  (language) => {
    i18next.changeLanguage(language);
  },
);

export default i18next;
