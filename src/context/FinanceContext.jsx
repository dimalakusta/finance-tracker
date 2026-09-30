import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../services/api";


const FinanceContext = createContext(null);


/*
 * Сортування:
 * 1. Спочатку новіша дата
 * 2. Якщо дата однакова — новіша операція за createdAt
 */
function sortTransactions(transactions) {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(
      `${a.date}T00:00:00`
    ).getTime();

    const dateB = new Date(
      `${b.date}T00:00:00`
    ).getTime();

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    const createdA = new Date(
      a.createdAt || 0
    ).getTime();

    const createdB = new Date(
      b.createdAt || 0
    ).getTime();

    return createdB - createdA;
  });
}


export function FinanceProvider({
  children,
}) {
  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  /*
   * Завантаження операцій
   */
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await api.getTransactions();

      setTransactions(
        sortTransactions(
          Array.isArray(data)
            ? data
            : []
        )
      );
    } catch (err) {
      console.error(
        "Transactions loading error:",
        err
      );

      setError(
        err.message ||
          "Не вдалося завантажити дані"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTransactions();
  }, []);


  /*
   * Додати операцію
   */
  const createTransaction =
    async (transaction) => {
      try {
        const created =
          await api.addTransaction(
            transaction
          );

        setTransactions((prev) =>
          sortTransactions([
            ...prev,
            created,
          ])
        );

        return created;
      } catch (error) {
        console.error(
          "Create transaction error:",
          error
        );

        throw error;
      }
    };


  /*
   * Редагувати операцію
   */
  const updateTransaction =
    async (id, transaction) => {
      try {
        const updated =
          await api.updateTransaction({
            ...transaction,
            id,
          });

        setTransactions((prev) =>
          sortTransactions(
            prev.map((item) =>
              item.id === id
                ? updated
                : item
            )
          )
        );

        return updated;
      } catch (error) {
        console.error(
          "Update transaction error:",
          error
        );

        throw error;
      }
    };


  /*
   * Видалити операцію
   */
  const removeTransaction =
    async (id) => {
      try {
        await api.deleteTransaction(id);

        setTransactions((prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
        );
      } catch (error) {
        console.error(
          "Delete transaction error:",
          error
        );

        throw error;
      }
    };


  const value = useMemo(
    () => ({
      transactions,
      loading,
      error,

      createTransaction,
      updateTransaction,
      removeTransaction,

      reload:
        loadTransactions,
    }),
    [
      transactions,
      loading,
      error,
    ]
  );


  return (
    <FinanceContext.Provider
      value={value}
    >
      {children}
    </FinanceContext.Provider>
  );
}


export function useFinance() {
  const context =
    useContext(FinanceContext);

  if (!context) {
    throw new Error(
      "useFinance must be used inside FinanceProvider"
    );
  }

  return context;
}