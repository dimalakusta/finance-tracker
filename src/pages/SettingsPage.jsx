import {
  useState,
} from "react";

import {
  Sun,
  Moon,
  Globe,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";


export default function SettingsPage() {
  const {
    language,
    theme,
    categories,
    setLanguage,
    setTheme,
    addCategory,
    updateCategory,
    removeCategory,
  } = useSettings();


  const t =
    translations[language];


  const [newName, setNewName] =
    useState("");

  const [newType, setNewType] =
    useState("expense");

  const [newIcon, setNewIcon] =
    useState("📁");


  const [editing, setEditing] =
    useState(null);

  const [editName, setEditName] =
    useState("");

  const [editIcon, setEditIcon] =
    useState("");


  /*
   * Додавання категорії
   */
  const handleAdd = async () => {
    const name =
      newName.trim();

    if (!name) {
      return;
    }


    try {
      await addCategory({
        type: newType,
        name,
        icon:
          newIcon.trim() ||
          "📁",
      });


      setNewName("");
      setNewIcon("📁");

    } catch (error) {
      console.error(
        "Category add error:",
        error
      );
    }
  };


  /*
   * Початок редагування
   */
  const startEdit = (category) => {
    setEditing(category.id);
    setEditName(category.name);
    setEditIcon(category.icon || "📁");
  };


  /*
   * Збереження редагування
   */
  const saveEdit = async (category) => {
    const name =
      editName.trim();

    if (!name) {
      return;
    }


    try {
      await updateCategory({
        ...category,
        name,
        icon:
          editIcon.trim() ||
          "📁",
      });

      setEditing(null);

    } catch (error) {
      console.error(
        "Category update error:",
        error
      );
    }
  };


  /*
   * Видалення категорії
   */
  const handleDelete = async (id) => {
    try {
      await removeCategory(id);
    } catch (error) {
      console.error(
        "Category delete error:",
        error
      );
    }
  };


  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>
            {t.settings}
          </h1>

          <p>
            {t.language},{" "}
            {t.theme},{" "}
            {t.categories}
          </p>
        </div>

      </div>


      {/* =========================
          LANGUAGE
      ========================= */}

      <section className="settings-card">

        <div className="settings-section-title">
          <Globe size={20} />

          <h2>
            {t.language}
          </h2>
        </div>


        <div className="settings-options">

          <button
            type="button"
            className={
              language === "uk"
                ? "settings-option active"
                : "settings-option"
            }
            onClick={() =>
              setLanguage("uk")
            }
          >
            🇺🇦

            <span>
              {t.ukrainian}
            </span>

            {language === "uk" && (
              <Check />
            )}
          </button>


          <button
            type="button"
            className={
              language === "en"
                ? "settings-option active"
                : "settings-option"
            }
            onClick={() =>
              setLanguage("en")
            }
          >
            🇬🇧

            <span>
              {t.english}
            </span>

            {language === "en" && (
              <Check />
            )}
          </button>

        </div>

      </section>


      {/* =========================
          THEME
      ========================= */}

      <section className="settings-card">

        <div className="settings-section-title">

          {theme === "dark" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}

          <h2>
            {t.theme}
          </h2>

        </div>


        <div className="theme-switch">

          <button
            type="button"
            className={
              theme === "light"
                ? "theme-option active"
                : "theme-option"
            }
            onClick={() =>
              setTheme("light")
            }
          >
            <Sun size={18} />

            {t.light}
          </button>


          <button
            type="button"
            className={
              theme === "dark"
                ? "theme-option active"
                : "theme-option"
            }
            onClick={() =>
              setTheme("dark")
            }
          >
            <Moon size={18} />

            {t.dark}
          </button>

        </div>

      </section>


      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="settings-card">

        <div className="settings-section-title">

          <h2>
            {t.categories}
          </h2>

        </div>


        <div className="category-add-form">

          <select
            value={newType}
            onChange={(event) =>
              setNewType(
                event.target.value
              )
            }
          >
            <option value="expense">
              {t.expenses}
            </option>

            <option value="income">
              {t.income}
            </option>
          </select>


          <input
            value={newIcon}
            onChange={(event) =>
              setNewIcon(
                event.target.value
              )
            }
            className="icon-input"
            placeholder="📁"
          />


          <input
            value={newName}
            onChange={(event) =>
              setNewName(
                event.target.value
              )
            }
            placeholder={
              t.newCategory
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAdd();
              }
            }}
          />


          <button
            type="button"
            className="primary-button"
            onClick={handleAdd}
          >
            <Plus size={18} />

            {t.addCategory}
          </button>

        </div>


        <div className="category-settings-list">

          {categories.map(
            (category) => {

              const isEditing =
                String(editing) ===
                String(category.id);


              return (
                <div
                  className="category-settings-item"
                  key={
                    category.id ||
                    `${category.type}-${category.name}`
                  }
                >

                  {isEditing ? (
                    <>

                      <input
                        className="icon-input"
                        value={editIcon}
                        onChange={(event) =>
                          setEditIcon(
                            event.target.value
                          )
                        }
                      />


                      <input
                        value={editName}
                        onChange={(event) =>
                          setEditName(
                            event.target.value
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            saveEdit(category);
                          }
                        }}
                      />


                      <button
                        type="button"
                        className="icon-button success"
                        onClick={() =>
                          saveEdit(
                            category
                          )
                        }
                      >
                        <Check size={17} />
                      </button>


                      <button
                        type="button"
                        className="icon-button"
                        onClick={() =>
                          setEditing(null)
                        }
                      >
                        <X size={17} />
                      </button>

                    </>
                  ) : (
                    <>

                      <div className="category-name">

                        <span className="category-icon">
                          {category.icon}
                        </span>

                        <span>
                          {category.name}
                        </span>

                        <small>
                          {category.type ===
                          "income"
                            ? t.income
                            : t.expenses}
                        </small>

                      </div>


                      <div className="category-actions">

                        <button
                          type="button"
                          className="icon-button"
                          onClick={() =>
                            startEdit(
                              category
                            )
                          }
                        >
                          <Pencil size={17} />
                        </button>


                        <button
                          type="button"
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(
                              category.id
                            )
                          }
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </>
                  )}

                </div>
              );
            }
          )}

        </div>

      </section>

    </div>
  );
}