export function calculateTotals(
  transactions
) {
  return transactions.reduce(
    (result, transaction) => {
      const amount =
        Number(transaction.amount) || 0;

      if (
        transaction.type === "income"
      ) {
        result.income += amount;
      }

      if (
        transaction.type === "expense"
      ) {
        result.expenses += amount;
      }

      result.balance =
        result.income -
        result.expenses;

      return result;
    },
    {
      income: 0,
      expenses: 0,
      balance: 0,
    }
  );
}


export function formatMoney(
  value
) {
  return new Intl.NumberFormat(
    "uk-UA",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value) || 0
  );
}


export function getMonthTransactions(
  transactions,
  date
) {
  const year =
    date.getFullYear();

  const month =
    date.getMonth();

  return transactions.filter(
    (transaction) => {
      const transactionDate =
        new Date(
          transaction.date
        );

      return (
        transactionDate.getFullYear() ===
          year &&
        transactionDate.getMonth() ===
          month
      );
    }
  );
}


export function formatDate(
  value
) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(
    date.getTime()
  )) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "uk-UA",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(date);
}