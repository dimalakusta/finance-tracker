import {
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  useFinance,
} from "../context/FinanceContext";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  translations,
} from "../utils/translations";

import {
  calculateTotals,
  formatMoney,
  getMonthTransactions,
} from "../utils/calculations";

import PageLoader from "../Components/PageLoader";


export default function AnalyticsPage() {
  const {
    transactions,
    loading,
  } = useFinance();

  const {
    language,
  } = useSettings();

  const t =
    translations[language];


  const [month, setMonth] =
    useState(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      )
    );


  const previousMonth =
    new Date(
      month.getFullYear(),
      month.getMonth() - 1,
      1
    );


  const monthTransactions =
    useMemo(
      () =>
        getMonthTransactions(
          transactions,
          month
        ),
      [transactions, month]
    );


  const previousTransactions =
    useMemo(
      () =>
        getMonthTransactions(
          transactions,
          previousMonth
        ),
      [
        transactions,
        previousMonth.getFullYear(),
        previousMonth.getMonth(),
      ]
    );


  const totals =
    calculateTotals(
      monthTransactions
    );


  const previousTotals =
    calculateTotals(
      previousTransactions
    );


  const monthName =
    new Intl.DateTimeFormat(
      language === "uk"
        ? "uk-UA"
        : "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(month);


  const chartData =
    useMemo(() => {
      const result = {};

      monthTransactions.forEach(
        (transaction) => {
          const date =
            new Date(
              transaction.date
            );

          const key =
            String(
              date.getDate()
            ).padStart(2, "0");


          if (!result[key]) {
            result[key] = {
              date: key,
              income: 0,
              expenses: 0,
            };
          }


          if (
            transaction.type ===
            "income"
          ) {
            result[key].income +=
              Number(
                transaction.amount
              );
          } else {
            result[key].expenses +=
              Number(
                transaction.amount
              );
          }
        }
      );


      return Object.values(
        result
      ).sort(
        (a, b) =>
          Number(a.date) -
          Number(b.date)
      );
    }, [
      monthTransactions,
    ]);


  const categoryData =
    useMemo(() => {
      const data = {};

      monthTransactions
        .filter(
          (item) =>
            item.type ===
            "expense"
        )
        .forEach(
          (item) => {
            const name =
              item.category ||
              "Інше";

            data[name] =
              (data[name] || 0) +
              Number(
                item.amount
              );
          }
        );


      return Object.entries(
        data
      )
        .map(
          ([name, value]) => ({
            name,
            value,
          })
        )
        .sort(
          (a, b) =>
            b.value - a.value
        );
    }, [
      monthTransactions,
    ]);


  const balance =
    totals.balance;

  const previousBalance =
    previousTotals.balance;

  const difference =
    balance -
    previousBalance;


  const previousMonthName =
    new Intl.DateTimeFormat(
      language === "uk"
        ? "uk-UA"
        : "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(
      previousMonth
    );


  const prev =
    () =>
      setMonth(
        new Date(
          month.getFullYear(),
          month.getMonth() - 1,
          1
        )
      );


  const next =
    () =>
      setMonth(
        new Date(
          month.getFullYear(),
          month.getMonth() + 1,
          1
        )
      );


  if (loading) {
    return <PageLoader />;
  }


  return (
    <div className="page">

      <div className="page-header analytics-header">

        <div>
          <h1>
            {t.analyticsTitle}
          </h1>

          <p>
            {t.monthlyAnalytics}
          </p>
        </div>


        <div className="month-selector">

          <button
            className="icon-button"
            onClick={prev}
          >
            <ChevronLeft />
          </button>

          <strong>
            {monthName}
          </strong>

          <button
            className="icon-button"
            onClick={next}
          >
            <ChevronRight />
          </button>

        </div>

      </div>


      <div className="stats-grid">

        <div className="analytics-stat income-stat">
          <TrendingUp />

          <span>
            {t.monthlyIncome}
          </span>

          <strong>
            +{formatMoney(
              totals.income
            )} ₴
          </strong>
        </div>


        <div className="analytics-stat expense-stat">
          <TrendingDown />

          <span>
            {t.monthlyExpenses}
          </span>

          <strong>
            -{formatMoney(
              totals.expenses
            )} ₴
          </strong>
        </div>


        <div className="analytics-stat balance-stat">
          <Wallet />

          <span>
            {t.monthlyBalance}
          </span>

          <strong>
            {formatMoney(
              balance
            )} ₴
          </strong>
        </div>

      </div>


      <section className="analytics-card">

        <div className="section-heading">

          <div>
            <h2>
              {t.monthlyAnalytics}
            </h2>

            <span>
              {monthName}
            </span>
          </div>

        </div>


        <ResponsiveContainer
          width="100%"
          height={330}
        >
          <AreaChart
            data={chartData}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
            />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="income"
              name={t.income}
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.12}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              name={t.expenses}
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.12}
            />

          </AreaChart>
        </ResponsiveContainer>

      </section>


      <section className="analytics-card">

        <h2>
          {t.expensesByCategory}
        </h2>


        {categoryData.length > 0 && (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                label
              >
                {categoryData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}


        <div className="category-list">

          {categoryData.map(
            (item) => (
              <div
                className="category-row"
                key={item.name}
              >
                <span>
                  {item.name}
                </span>

                <strong>
                  {formatMoney(
                    item.value
                  )} ₴
                </strong>
              </div>
            )
          )}

        </div>

      </section>


      <section className="analytics-card">

        <h2>
          {t.monthComparison}
        </h2>

        <div className="comparison-grid">

          <div>
            <span>
              {t.currentMonth}
            </span>

            <strong>
              {formatMoney(
                balance
              )} ₴
            </strong>
          </div>


          <div>
            <span>
              {t.previousMonth}
            </span>

            <strong>
              {formatMoney(
                previousBalance
              )} ₴
            </strong>
          </div>


          <div>
            <span>
              {t.difference}
            </span>

            <strong
              className={
                difference >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {difference >= 0
                ? "+"
                : ""}
              {formatMoney(
                difference
              )} ₴
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}