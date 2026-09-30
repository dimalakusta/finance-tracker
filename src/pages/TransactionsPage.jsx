import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
  Plus,
  X,
} from "lucide-react";

import {
  useFinance,
} from "../context/FinanceContext";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";

import TransactionCard from "../Components/TransactionCard";
import TransactionModal from "../Components/TransactionModal";
import ConfirmModal from "../Components/ConfirmModal";
import EmptyState from "../Components/EmptyState";
import PageLoader from "../Components/PageLoader";


export default function TransactionsPage() {
  const {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useFinance();

  const {
    language,
    categories,
  } = useSettings();

  const t =
    translations[language];


  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("all");

  const [category, setCategory] =
    useState("");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [deleting, setDeleting] =
    useState(null);


  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return transactions.filter(
        (transaction) => {

          if (
            type !== "all" &&
            transaction.type !==
              type
          ) {
            return false;
          }


          if (
            category &&
            transaction.category !==
              category
          ) {
            return false;
          }


          if (
            dateFrom &&
            transaction.date <
              dateFrom
          ) {
            return false;
          }


          if (
            dateTo &&
            transaction.date >
              dateTo
          ) {
            return false;
          }


          if (query) {
            const text = [
              transaction.category,
              transaction.description,
            ]
              .join(" ")
              .toLowerCase();

            if (
              !text.includes(
                query
              )
            ) {
              return false;
            }
          }


          return true;
        }
      );
    }, [
      transactions,
      search,
      type,
      category,
      dateFrom,
      dateTo,
    ]);


  const clearFilters = () => {
    setSearch("");
    setType("all");
    setCategory("");
    setDateFrom("");
    setDateTo("");
  };


  const save =
    async (data) => {
      if (editing) {
        await updateTransaction(
          editing.id,
          data
        );
      } else {
        await createTransaction(
          data
        );
      }

      setModalOpen(false);
      setEditing(null);
    };


  const deleteItem =
    async () => {
      if (!deleting) return;

      await removeTransaction(
        deleting.id
      );

      setDeleting(null);
    };


  if (loading) {
    return <PageLoader />;
  }


  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h1>
            {t.allTransactions}
          </h1>

          <p>
            {filtered.length}{" "}
            {t.transactionsCount}
          </p>
        </div>


        <button
          className="primary-button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} />

          <span>
            {t.addTransaction}
          </span>
        </button>

      </div>


      <div className="transactions-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={
              t.searchPlaceholder
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={16} />
            </button>
          )}

        </div>


        <button
          className={
            filtersOpen
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() =>
            setFiltersOpen(
              (value) => !value
            )
          }
        >
          <SlidersHorizontal
            size={18}
          />

          {t.filters}
        </button>

      </div>


      {filtersOpen && (
        <div className="filters-panel">

          <div className="filter-group">

            <label>
              {t.expenses}
            </label>

            <div className="segmented-control">

              <button
                className={
                  type === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setType("all")
                }
              >
                {t.all}
              </button>

              <button
                className={
                  type === "income"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setType("income")
                }
              >
                {t.income}
              </button>

              <button
                className={
                  type === "expense"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setType("expense")
                }
              >
                {t.expenses}
              </button>

            </div>

          </div>


          <div className="filter-group">

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
            >
              <option value="">
                {t.all}
              </option>

              {categories.map(
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


          <div className="filter-group">

            <label>
              {t.dateFrom}
            </label>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) =>
                setDateFrom(
                  event.target.value
                )
              }
            />

          </div>


          <div className="filter-group">

            <label>
              {t.dateTo}
            </label>

            <input
              type="date"
              value={dateTo}
              onChange={(event) =>
                setDateTo(
                  event.target.value
                )
              }
            />

          </div>


          <button
            className="secondary-button"
            onClick={
              clearFilters
            }
          >
            {t.clearFilters}
          </button>

        </div>
      )}


      {filtered.length === 0 ? (
        <EmptyState
          title={
            search ||
            category ||
            dateFrom ||
            dateTo ||
            type !== "all"
              ? t.noResults
              : t.noTransactions
          }
        />
      ) : (
        <div className="transactions-list">
          {filtered.map(
            (transaction) => (
              <TransactionCard
                key={
                  transaction.id
                }
                transaction={
                  transaction
                }
                onEdit={() => {
                  setEditing(
                    transaction
                  );
                  setModalOpen(
                    true
                  );
                }}
                onDelete={() =>
                  setDeleting(
                    transaction
                  )
                }
              />
            )
          )}
        </div>
      )}


      {modalOpen && (
        <TransactionModal
          transaction={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}


      {deleting && (
        <ConfirmModal
          onCancel={() =>
            setDeleting(null)
          }
          onConfirm={
            deleteItem
          }
        />
      )}

    </div>
  );
}