import React from 'react';
import { useTransactions } from '../../context/TransactionContext';

const MonthlySummary = () => {
  const { transactions } = useTransactions();

  const getMonthlyData = () => {
    const months = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!months[key]) months[key] = { label, income: 0, expense: 0 };
      if (t.type === 'Income') months[key].income += t.amount;
      else months[key].expense += t.amount;
    });
    return Object.values(months).slice(-6).reverse();
  };

  const data = getMonthlyData();

  if (data.length === 0) return null;

  return (
    <div style={{ padding: '0 32px 8px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
        Monthly Summary
      </h2>
      <div className="monthly-grid" style={{ padding: 0 }}>
        {data.map((m, i) => {
          const balance = m.income - m.expense;
          return (
            <div key={i} className="monthly-card">
              <div className="monthly-name">{m.label}</div>
              <div className="monthly-balance" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                ${Math.abs(balance).toFixed(0)}
              </div>
              <div className="monthly-detail" style={{ color: 'var(--success)' }}>↑ ${m.income.toFixed(0)}</div>
              <div className="monthly-detail" style={{ color: 'var(--danger)' }}>↓ ${m.expense.toFixed(0)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlySummary;