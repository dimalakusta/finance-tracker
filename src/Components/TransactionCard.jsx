import {
  Pencil,
  Trash2,
} from "lucide-react";

import {
  formatMoney,
  formatDate,
} from "../utils/calculations";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";


export default function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}) {
  const {
    language,
    categories,
  } = useSettings();

  const t =
    translations[language];

  const category =
    categories.find(
      (item) =>
        item.name ===
        transaction.category
    );

  const isIncome =
    transaction.type === "income";

  return (
    <div className="transaction-card">
      <div
        className={`transaction-icon ${
          isIncome
            ? "income"
            : "expense"
        }`}
      >
        {category?.icon ||
          (isIncome
            ? "↗"
            : "↘")}
      </div>

      <div className="transaction-info">
        <strong>
          {transaction.category ||
            "Інше"}
        </strong>

        <span>
          {transaction.description ||
            "—"}
        </span>

        <small>
          {formatDate(
            transaction.date
          )}
        </small>
      </div>

      <div className="transaction-right">
        <strong
          className={
            isIncome
              ? "transaction-income"
              : "transaction-expense"
          }
        >
          {isIncome ? "+" : "-"}
          {formatMoney(
            transaction.amount
          )}
        </strong>

        <div className="transaction-actions">
          <button
            className="icon-button"
            onClick={onEdit}
            title={t.edit}
          >
            <Pencil size={15} />
          </button>

          <button
            className="icon-button danger"
            onClick={onDelete}
            title={t.delete}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}