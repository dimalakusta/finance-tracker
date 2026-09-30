import axios from "axios";

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

if (!API_URL) {
  console.error(
    "VITE_APPS_SCRIPT_URL не заданий. Перевір файл .env у корені проєкту."
  );
}

const client = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

const request = async (action, payload = {}) => {
  try {
    const response = await client.get("", {
      params: {
        action,
        ...payload,
      },
    });

    const body = response.data;

    if (body?.success === false) {
      throw new Error(
        body.error || "Google Apps Script повернув помилку"
      );
    }

    // Code.gs повертає:
    // { success: true, data: ... }
    return body?.success === true && "data" in body
      ? body.data
      : body;
  } catch (error) {
    console.error(`API error [${action}]:`, error);

    if (error.response) {
      throw new Error(
        error.response.data?.error ||
          error.response.data?.message ||
          `Помилка сервера: ${error.response.status}`
      );
    }

    if (error.request) {
      throw new Error(
        "Не вдалося отримати відповідь від Google Apps Script. Перевір URL у .env та доступ вебзастосунку."
      );
    }

    throw new Error(
      error.message || "Невідома помилка API"
    );
  }
};


/* =========================
   TRANSACTIONS
========================= */

const getTransactions = async () => {
  return request("getTransactions");
};


const addTransaction = async (transaction) => {
  return request("addTransaction", {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description || "",
    date: transaction.date,
  });
};


const updateTransaction = async (transaction) => {
  return request("updateTransaction", {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description || "",
    date: transaction.date,
  });
};


const deleteTransaction = async (id) => {
  return request("deleteTransaction", {
    id,
  });
};


/* =========================
   SETTINGS
========================= */

const getSettings = async () => {
  return request("getSettings");
};


const updateSetting = async (key, value) => {
  return request("updateSetting", {
    key,
    value,
  });
};


/* =========================
   CATEGORIES
========================= */

const getCategories = async () => {
  return request("getCategories");
};


const addCategory = async (category) => {
  return request("addCategory", {
    type: category.type,
    name: category.name,
    icon: category.icon || "📁",
  });
};


const updateCategory = async (category) => {
  return request("updateCategory", {
    id: category.id,
    type: category.type,
    name: category.name,
    icon: category.icon || "📁",
  });
};


const deleteCategory = async (id) => {
  return request("deleteCategory", {
    id,
  });
};


/* =========================
   API
========================= */

export const api = {
  // Transactions
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,

  // Settings
  getSettings,
  updateSetting,

  // Categories
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};

export default api;