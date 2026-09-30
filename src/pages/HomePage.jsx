import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

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
} from "../utils/calculations";

import StatCard from "../Components/StatCard";
import TransactionCard from "../Components/TransactionCard";
import TransactionModal from "../Components/TransactionModal";
import ConfirmModal from "../Components/ConfirmModal";
import PageLoader from "../Components/PageLoader";
import EmptyState from "../Components/EmptyState";


export default function HomePage() {
  const {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useFinance();

  const {
    language,
  } = useSettings();

  const t =
    translations[language];

  const navigate =
    useNavigate();


  const [modalOpen, setModalOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [deleting, setDeleting] =
    useState(null);


  const totals =
    useMemo(
      () =>
        calculateTotals(
          transactions
        ),
      [transactions]
    );


  const recent =
    transactions.slice(0, 8);


  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };


  const saveTransaction =
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


  const confirmDelete =
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
            {t.home}
          </h1>

          <p>
            Finance Tracker
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAdd}
        >
          <Plus size={18} />

          <span>
            {t.addTransaction}
          </span>
        </button>
      </div>


      <div className="balance-card">
        <div>
          <span>
            {t.balance}
          </span>

          <strong>
            {formatMoney(
              totals.balance
            )} ₴
          </strong>
        </div>

        <div className="balance-icon">
          <Wallet size={27} />
        </div>
      </div>


      <div className="stats-grid">
        <StatCard
          title={t.income}
          value={`+${formatMoney(
            totals.income
          )} ₴`}
          type="income"
          icon={
            <TrendingUp size={20} />
          }
        />

        <StatCard
          title={t.expenses}
          value={`-${formatMoney(
            totals.expenses
          )} ₴`}
          type="expense"
          icon={
            <TrendingDown size={20} />
          }
        />

        <StatCard
          title={t.balance}
          value={`${formatMoney(
            totals.balance
          )} ₴`}
          type="balance"
          icon={
            <Wallet size={20} />
          }
        />
      </div>


      <section className="section-card">

        <div className="section-heading">

          <div>
            <h2>
              {t.recentTransactions}
            </h2>
          </div>

          <button
            className="text-button"
            onClick={() =>
              navigate(
                "/transactions"
              )
            }
          >
            {t.allTransactions}

            <ArrowRight
              size={16}
            />
          </button>

        </div>


        {recent.length === 0 ? (
          <EmptyState
            title={
              t.noTransactions
            }
          />
        ) : (
          <div className="transactions-list">
            {recent.map(
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

      </section>


      {modalOpen && (
        <TransactionModal
          transaction={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={
            saveTransaction
          }
        />
      )}


      {deleting && (
        <ConfirmModal
          onCancel={() =>
            setDeleting(null)
          }
          onConfirm={
            confirmDelete
          }
        />
      )}

    </div>
  );
}