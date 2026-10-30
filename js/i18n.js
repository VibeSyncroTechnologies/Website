/* VibeSyncro bilingual interface loader.
   Locale dictionaries are static JSON under /locales and work on GitHub Pages. */
(function (window, document) {
  "use strict";

  const supported = ["en", "hi"];
  const fallback = "en";
  let dictionary = {};
  let activeLanguage = fallback;
  let initPromise = null;

  function readSavedLanguage() {
    try {
      const saved = window.localStorage.getItem("vibesyncro-language");
      return supported.includes(saved) ? saved : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function translateDom(dict) {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        element.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const declarations = element.getAttribute("data-i18n-attr").split(",");
      declarations.forEach((declaration) => {
        const parts = declaration.trim().split(":");
        const attribute = parts[0];
        const key = parts[1];
        if (attribute && key && Object.prototype.hasOwnProperty.call(dict, key)) {
          element.setAttribute(attribute, dict[key]);
        }
      });
    });

    document.querySelectorAll("#languageSelect, #languageSelectMobile").forEach((select) => {
      select.value = activeLanguage;
    });
  }

  async function apply(language, options) {
    const requested = supported.includes(language) ? language : fallback;
    const settings = options || {};

    try {
      const url = new URL("locales/" + requested + ".json", document.baseURI);
      const response = await fetch(url.toString(), { cache: "no-cache" });
      if (!response.ok) {
        throw new Error("Locale request failed with HTTP " + response.status);
      }

      const translations = await response.json();
      dictionary = translations;
      activeLanguage = requested;
      document.documentElement.lang = requested;
      translateDom(dictionary);

      if (settings.persist !== false) {
        try {
          window.localStorage.setItem("vibesyncro-language", requested);
        } catch (_) {
          // Language switching still works when browser storage is disabled.
        }
      }

      document.dispatchEvent(new CustomEvent("vibesyncro:languagechange", {
        detail: { language: activeLanguage }
      }));
      return true;
    } catch (error) {
      console.error("VibeSyncro translations could not be loaded:", error);
      if (requested !== fallback) {
        return apply(fallback, { persist: false });
      }
      activeLanguage = fallback;
      document.documentElement.lang = fallback;
      translateDom({});
      return false;
    }
  }

  function bindSelectors() {
    document.querySelectorAll("#languageSelect, #languageSelectMobile").forEach((select) => {
      if (select.dataset.i18nBound === "true") return;
      select.dataset.i18nBound = "true";
      select.addEventListener("change", () => {
        apply(select.value);
      });
    });
  }

  function init() {
    if (initPromise) return initPromise;
    bindSelectors();
    initPromise = apply(readSavedLanguage(), { persist: false });
    return initPromise;
  }

  function t(key) {
    return Object.prototype.hasOwnProperty.call(dictionary, key)
      ? dictionary[key]
      : key;
  }

  window.VibeI18n = {
    init,
    apply,
    t,
    get language() { return activeLanguage; },
    get supportedLanguages() { return supported.slice(); }
  };
})(window, document);
