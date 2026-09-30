import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";


export default function TransactionModal({
  transaction,
  onClose,
  onSave,
}) {
  const {
    language,
    categories,
  } = useSettings();


  const t =
    translations[language];


  const [type, setType] =
    useState(
      transaction?.type ||
        "expense"
    );


  const [amount, setAmount] =
    useState(
      transaction?.amount ||
        ""
    );


  const [category, setCategory] =
    useState(
      transaction?.category ||
        ""
    );


  const [description, setDescription] =
    useState(
      transaction?.description ||
        ""
    );


  const [date, setDate] =
    useState(
      transaction?.date ||
        new Date()
          .toISOString()
          .split("T")[0]
    );


  const [saving, setSaving] =
    useState(false);


  const filteredCategories =
    categories.filter(
      (item) =>
        item.type === type
    );


  /*
   * Автоматично вибираємо першу
   * категорію відповідного типу
   */
  useEffect(() => {
    if (
      filteredCategories.length &&
      !filteredCategories.some(
        (item) =>
          item.name === category
      )
    ) {
      setCategory(
        filteredCategories[0].name
      );
    }

    if (
      !filteredCategories.length
    ) {
      setCategory("");
    }
  }, [
    type,
    categories,
  ]);


  /*
   * Збереження
   */
  const handleSubmit =
    async (event) => {
      event.preventDefault();


      if (
        !amount ||
        Number(amount) <= 0 ||
        !category ||
        !date
      ) {
        return;
      }


      try {
        setSaving(true);

        await onSave({
          type,
          amount:
            Number(amount),
          category,
          description,
          date,
        });

      } catch (error) {
        console.error(
          "Transaction save error:",
          error
        );

      } finally {
        setSaving(false);
      }
    };


  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        /*
         * Якщо натиснули саме на overlay,
         * а не всередині модального вікна
         */
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div
        className="transaction-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        <div className="modal-header">

          <div>
            <h2>
              {transaction
                ? t.editTransaction
                : t.addTransaction}
            </h2>
          </div>


          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="transaction-form"
        >

          <div className="type-switch">

            <button
              type="button"
              className={
                type === "expense"
                  ? "active expense"
                  : ""
              }
              onClick={() =>
                setType("expense")
              }
            >
              {t.expense}
            </button>


            <button
              type="button"
              className={
                type === "income"
                  ? "active income"
                  : ""
              }
              onClick={() =>
                setType("income")
              }
            >
              {t.incomeTransaction}
            </button>

          </div>


          <div className="form-group">

            <label>
              {t.amount}
            </label>


            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="0.00"
              required
            />

          </div>


          <div className="form-group">

            <label>
              {t.category}
            </label>


            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              required
            >

              <option value="">
                {t.category}
              </option>


              {filteredCategories.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.icon}{" "}
                    {item.name}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="form-group">

            <label>
              {t.description}
            </label>


            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder={
                t.description
              }
              rows="2"
            />

          </div>


          <div className="form-group">

            <label>
              {t.date}
            </label>


            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
              required
            />

          </div>


          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              {t.cancel}
            </button>


            <button
              type="submit"
              className="primary-button"
              disabled={
                saving ||
                filteredCategories.length === 0
              }
            >
              {saving
                ? "..."
                : t.save}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}