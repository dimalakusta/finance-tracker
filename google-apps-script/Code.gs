const SPREADSHEET_ID =
  "ВСТАВ_СЮДИ_ID_ТАБЛИЦІ";


const TRANSACTIONS_SHEET =
  "Transactions";

const CATEGORIES_SHEET =
  "Categories";

const SETTINGS_SHEET =
  "Settings";


function getSpreadsheet() {
  return SpreadsheetApp.openById(
    SPREADSHEET_ID
  );
}


function getSheet(name) {
  const spreadsheet =
    getSpreadsheet();

  let sheet =
    spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet =
      spreadsheet.insertSheet(name);
  }

  return sheet;
}


/*
 * Створення необхідних аркушів
 */
function setupSheets() {
  const transactions =
    getSheet(
      TRANSACTIONS_SHEET
    );

  const categories =
    getSheet(
      CATEGORIES_SHEET
    );

  const settings =
    getSheet(
      SETTINGS_SHEET
    );


  /*
   * Transactions
   */
  if (
    transactions.getLastRow() === 0
  ) {
    transactions.appendRow([
      "id",
      "type",
      "amount",
      "category",
      "description",
      "date",
      "createdAt",
    ]);
  }


  /*
   * Categories
   */
  if (
    categories.getLastRow() === 0
  ) {
    categories.appendRow([
      "id",
      "type",
      "name",
      "icon",
    ]);


    const defaultCategories = [
      [
        "1",
        "expense",
        "Продукти",
        "🛒",
      ],
      [
        "2",
        "expense",
        "Транспорт",
        "🚗",
      ],
      [
        "3",
        "expense",
        "Розваги",
        "🎮",
      ],
      [
        "4",
        "expense",
        "Здоров'я",
        "💊",
      ],
      [
        "5",
        "expense",
        "Комунальні",
        "🏠",
      ],
      [
        "6",
        "expense",
        "Покупки",
        "🛍️",
      ],
      [
        "7",
        "expense",
        "Ресторан",
        "🍔",
      ],
      [
        "8",
        "expense",
        "Підписки",
        "📱",
      ],
      [
        "9",
        "expense",
        "Освіта",
        "📚",
      ],
      [
        "10",
        "expense",
        "Інше",
        "📦",
      ],

      [
        "11",
        "income",
        "Зарплата",
        "💰",
      ],
      [
        "12",
        "income",
        "Фріланс",
        "💻",
      ],
      [
        "13",
        "income",
        "Подарунок",
        "🎁",
      ],
      [
        "14",
        "income",
        "Інше",
        "💵",
      ],
    ];


    categories
      .getRange(
        2,
        1,
        defaultCategories.length,
        4
      )
      .setValues(
        defaultCategories
      );
  }


  /*
   * Settings
   */
  if (
    settings.getLastRow() === 0
  ) {
    settings.appendRow([
      "key",
      "value",
    ]);


    settings.appendRow([
      "language",
      "uk",
    ]);


    settings.appendRow([
      "theme",
      "light",
    ]);
  }
}


/*
 * GET
 */
function doGet(e) {
  try {
    setupSheets();


    const action =
      e.parameter.action ||
      "getTransactions";


    const result =
      handleAction(
        action,
        e.parameter
      );


    return createResponse({
      success: true,
      data: result,
    });

  } catch (error) {

    return createResponse({
      success: false,
      error:
        error.message,
    });
  }
}


/*
 * POST
 */
function doPost(e) {
  try {
    setupSheets();


    const body =
      JSON.parse(
        e.postData.contents ||
          "{}"
      );


    const action =
      body.action;


    const result =
      handleAction(
        action,
        body.payload || {}
      );


    return createResponse({
      success: true,
      data: result,
    });

  } catch (error) {

    return createResponse({
      success: false,
      error:
        error.message,
    });
  }
}


/*
 * ACTION ROUTER
 */
function handleAction(
  action,
  payload
) {
  switch (action) {

    case "getTransactions":
      return getTransactions();

    case "addTransaction":
      return addTransaction(
        payload
      );

    case "updateTransaction":
      return updateTransaction(
        payload
      );

    case "deleteTransaction":
      return deleteTransaction(
        payload
      );


    case "getCategories":
      return getCategories();

    case "addCategory":
      return addCategory(
        payload
      );

    case "updateCategory":
      return updateCategory(
        payload
      );

    case "deleteCategory":
      return deleteCategory(
        payload
      );


    case "getSettings":
      return getSettings();

    case "updateSetting":
      return updateSetting(
        payload
      );


    default:
      throw new Error(
        "Unknown action: " +
          action
      );
  }
}


/* =========================
   TRANSACTIONS
========================= */

function getTransactions() {
  const sheet =
    getSheet(
      TRANSACTIONS_SHEET
    );


  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {
    return [];
  }


  const values =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        7
      )
      .getValues();


  return values
    .filter(
      (row) =>
        row[0] !== ""
    )
    .map((row) => ({
      id: String(
        row[0]
      ),

      type: String(
        row[1]
      ),

      amount:
        Number(row[2]) || 0,

      category:
        String(
          row[3] || ""
        ),

      description:
        String(
          row[4] || ""
        ),

      date:
        normalizeDate(
          row[5]
        ),

      createdAt:
        normalizeDateTime(
          row[6]
        ),
    }));
}


/*
 * Додати операцію
 */
function addTransaction(
  transaction
) {
  const sheet =
    getSheet(
      TRANSACTIONS_SHEET
    );


  const id =
    Utilities.getUuid();


  const createdAt =
    new Date().toISOString();


  sheet.appendRow([
    id,
    transaction.type,
    Number(
      transaction.amount
    ) || 0,
    transaction.category ||
      "",
    transaction.description ||
      "",
    transaction.date ||
      "",
    createdAt,
  ]);


  return {
    id,

    type:
      transaction.type,

    amount:
      Number(
        transaction.amount
      ) || 0,

    category:
      transaction.category ||
      "",

    description:
      transaction.description ||
      "",

    date:
      transaction.date ||
      "",

    createdAt,
  };
}


/*
 * Редагувати операцію
 */
function updateTransaction(
  transaction
) {
  const sheet =
    getSheet(
      TRANSACTIONS_SHEET
    );


  const row =
    findRowById(
      sheet,
      transaction.id
    );


  if (row === -1) {
    throw new Error(
      "Transaction not found"
    );
  }


  const oldCreatedAt =
    sheet
      .getRange(row, 7)
      .getValue();


  sheet
    .getRange(
      row,
      1,
      1,
      7
    )
    .setValues([
      [
        transaction.id,

        transaction.type,

        Number(
          transaction.amount
        ) || 0,

        transaction.category ||
          "",

        transaction.description ||
          "",

        transaction.date ||
          "",

        oldCreatedAt ||
          new Date().toISOString(),
      ],
    ]);


  return {
    id:
      transaction.id,

    type:
      transaction.type,

    amount:
      Number(
        transaction.amount
      ) || 0,

    category:
      transaction.category ||
      "",

    description:
      transaction.description ||
      "",

    date:
      transaction.date ||
      "",

    createdAt:
      normalizeDateTime(
        oldCreatedAt ||
          new Date().toISOString()
      ),
  };
}


/*
 * Видалити операцію
 */
function deleteTransaction(
  payload
) {
  const sheet =
    getSheet(
      TRANSACTIONS_SHEET
    );


  const row =
    findRowById(
      sheet,
      payload.id
    );


  if (row === -1) {
    throw new Error(
      "Transaction not found"
    );
  }


  sheet.deleteRow(row);


  return {
    id:
      payload.id,
  };
}


/* =========================
   CATEGORIES
========================= */

function getCategories() {
  const sheet =
    getSheet(
      CATEGORIES_SHEET
    );


  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {
    return [];
  }


  const values =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        4
      )
      .getValues();


  return values
    .filter(
      (row) =>
        row[0] !== ""
    )
    .map((row) => ({
      id:
        String(row[0]),

      type:
        String(row[1]),

      name:
        String(row[2]),

      icon:
        String(
          row[3] || ""
        ),
    }));
}


/*
 * Додати категорію
 */
function addCategory(
  category
) {
  const sheet =
    getSheet(
      CATEGORIES_SHEET
    );


  const categories =
    getCategories();


  const name =
    String(
      category.name || ""
    ).trim();


  if (!name) {
    throw new Error(
      "Category name is required"
    );
  }


  const exists =
    categories.some(
      (item) =>
        item.type ===
          category.type &&
        item.name
          .toLowerCase() ===
          name.toLowerCase()
    );


  if (exists) {
    throw new Error(
      "Category already exists"
    );
  }


  const id =
    Utilities.getUuid();


  const icon =
    category.icon ||
    "📁";


  sheet.appendRow([
    id,
    category.type,
    name,
    icon,
  ]);


  return {
    id,
    type:
      category.type,
    name,
    icon,
  };
}


/*
 * Редагувати категорію
 */
function updateCategory(
  category
) {
  const sheet =
    getSheet(
      CATEGORIES_SHEET
    );


  const row =
    findRowById(
      sheet,
      category.id
    );


  if (row === -1) {
    throw new Error(
      "Category not found"
    );
  }


  const name =
    String(
      category.name || ""
    ).trim();


  if (!name) {
    throw new Error(
      "Category name is required"
    );
  }


  sheet
    .getRange(
      row,
      2,
      1,
      3
    )
    .setValues([
      [
        category.type,

        name,

        category.icon ||
          "📁",
      ],
    ]);


  return {
    id:
      category.id,

    type:
      category.type,

    name,

    icon:
      category.icon ||
      "📁",
  };
}


/*
 * Видалити категорію
 */
function deleteCategory(
  payload
) {
  const sheet =
    getSheet(
      CATEGORIES_SHEET
    );


  const row =
    findRowById(
      sheet,
      payload.id
    );


  if (row === -1) {
    throw new Error(
      "Category not found"
    );
  }


  sheet.deleteRow(row);


  return {
    id:
      payload.id,
  };
}


/* =========================
   SETTINGS
========================= */

function getSettings() {
  const sheet =
    getSheet(
      SETTINGS_SHEET
    );


  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {
    return {};
  }


  const values =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        2
      )
      .getValues();


  const settings = {};


  values.forEach(
    (row) => {
      if (row[0]) {
        settings[
          String(row[0])
        ] =
          String(
            row[1] || ""
          );
      }
    }
  );


  return settings;
}


/*
 * Оновити налаштування
 */
function updateSetting(
  payload
) {
  const sheet =
    getSheet(
      SETTINGS_SHEET
    );


  const key =
    String(
      payload.key || ""
    );


  const value =
    String(
      payload.value ?? ""
    );


  if (!key) {
    throw new Error(
      "Setting key is required"
    );
  }


  const lastRow =
    sheet.getLastRow();


  for (
    let row = 2;
    row <= lastRow;
    row++
  ) {
    const currentKey =
      String(
        sheet
          .getRange(
            row,
            1
          )
          .getValue()
      );


    if (
      currentKey === key
    ) {

      sheet
        .getRange(
          row,
          2
        )
        .setValue(value);


      return {
        key,
        value,
      };
    }
  }


  sheet.appendRow([
    key,
    value,
  ]);


  return {
    key,
    value,
  };
}


/* =========================
   HELPERS
========================= */

function findRowById(
  sheet,
  id
) {
  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {
    return -1;
  }


  const ids =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        1
      )
      .getValues();


  for (
    let i = 0;
    i < ids.length;
    i++
  ) {

    if (
      String(
        ids[i][0]
      ) ===
      String(id)
    ) {
      return i + 2;
    }
  }


  return -1;
}


function normalizeDate(
  value
) {
  if (!value) {
    return "";
  }


  if (
    value instanceof Date
  ) {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );
  }


  return String(value);
}


function normalizeDateTime(
  value
) {
  if (!value) {
    return "";
  }


  if (
    value instanceof Date
  ) {
    return value.toISOString();
  }


  return String(value);
}


/*
 * JSON response
 */
function createResponse(
  data
) {
  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}