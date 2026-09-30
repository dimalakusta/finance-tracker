import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";


const SettingsContext =
  createContext(null);


export function SettingsProvider({
  children,
}) {
  const [language, setLanguageState] =
    useState("uk");

  const [theme, setThemeState] =
    useState("light");

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /*
   * Завантаження налаштувань
   * та категорій
   */
  const loadSettings = async () => {
    try {
      setLoading(true);

      const [
        settings,
        categoriesData,
      ] = await Promise.all([
        api.getSettings(),
        api.getCategories(),
      ]);


      setLanguageState(
        settings?.language || "uk"
      );


      setThemeState(
        settings?.theme || "light"
      );


      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : []
      );

    } catch (error) {
      console.error(
        "Settings loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadSettings();
  }, []);


  /*
   * Застосувати тему
   */
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);


  /*
   * Змінити мову
   */
  const setLanguage = async (value) => {
    // Спочатку змінюємо UI
    setLanguageState(value);

    try {
      // Потім зберігаємо в Google Sheets
      await api.updateSetting(
        "language",
        value
      );
    } catch (error) {
      console.error(
        "Language update error:",
        error
      );
    }
  };


  /*
   * Змінити тему
   */
  const setTheme = async (value) => {
    // Спочатку змінюємо UI
    setThemeState(value);

    try {
      // Потім зберігаємо в Google Sheets
      await api.updateSetting(
        "theme",
        value
      );
    } catch (error) {
      console.error(
        "Theme update error:",
        error
      );
    }
  };


  /*
   * Додати категорію
   */
  const addCategory = async ({
    type,
    name,
    icon,
  }) => {
    try {
      const category =
        await api.addCategory({
          type,
          name,
          icon,
        });


      setCategories((prev) => [
        ...prev,
        category,
      ]);


      return category;

    } catch (error) {
      console.error(
        "Add category error:",
        error
      );

      throw error;
    }
  };


  /*
   * Редагувати категорію
   */
  const updateCategory =
    async (category) => {
      try {
        const updated =
          await api.updateCategory(
            category
          );


        setCategories((prev) =>
          prev.map((item) =>
            String(item.id) ===
            String(category.id)
              ? updated
              : item
          )
        );


        return updated;

      } catch (error) {
        console.error(
          "Update category error:",
          error
        );

        throw error;
      }
    };


  /*
   * Видалити категорію
   */
  const removeCategory =
    async (id) => {
      try {
        await api.deleteCategory(id);

        setCategories((prev) =>
          prev.filter(
            (item) =>
              String(item.id) !==
              String(id)
          )
        );

      } catch (error) {
        console.error(
          "Delete category error:",
          error
        );

        throw error;
      }
    };


  return (
    <SettingsContext.Provider
      value={{
        language,
        theme,
        categories,
        loading,

        setLanguage,
        setTheme,

        addCategory,
        updateCategory,
        removeCategory,

        reloadSettings:
          loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}


export function useSettings() {
  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}