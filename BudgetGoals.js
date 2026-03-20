import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../common/Toast';

const CATEGORIES = ['Food','Rent','Salary','Bills','Transport','Shopping','Health','Entertainment','Other'];

const BudgetGoals = () => {
  const { transactions } = useTransactions();
  const { addToast } = useToast();
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('fintrack_budgets');
    return saved ? JSON.parse(saved) : {};
  });
  const [editMode, setEditMode] = useState(false);
  const [tempBudgets, setTempBudgets] = useState({});

  const saveBudgets = () => {
    localStorage.setItem('fintrack_budgets', JSON.stringify(tempBudgets));
    setBudgets(tempBudgets);
    setEditMode(false);
    addToast('Budget goals saved!', 'success');
  };

  const getSpent = (category) => {
    return transactions
      .filter((t) => t.type === 'Expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getColor = (percent) => {
    if (percent >= 100) return '#ef4444';
    if (percent >= 80) return '#f59e0b';
    return '#10b981';
  };

  const getStatus = (percent) => {
    if (percent >= 100) return '🚨 Exceeded!';
    if (percent >= 80) return '⚠️ Almost there';
    return '✅ On track';
  };

  return (
    <div style={{ padding: '0 32px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Budget Goals</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Set monthly spending limits per category</p>
        </div>
        {!editMode ? (
          <button className="btn btn-primary btn-sm" onClick={() => { setTempBudgets({ ...budgets }); setEditMode(true); }}>
            ✏️ Edit Budgets
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={saveBudgets}>💾 Save</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {CATEGORIES.map((cat) => {
          const budget = budgets[cat] || 0;
          const spent = getSpent(cat);
          const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          const color = getColor(percent);

          return (
            <div key={cat} className="budget-card">
              <div className="budget-header">
                <span className="budget-label">{cat}</span>
                <span className="budget-amount">
                  ${spent.toFixed(0)} / ${budget > 0 ? budget : '—'}
                </span>
              </div>
              {editMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Budget $</span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ padding: '5px 8px', fontSize: 12 }}
                    placeholder="Set budget..."
                    value={tempBudgets[cat] || ''}
                    onChange={(e) => setTempBudgets((prev) => ({ ...prev, [cat]: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              ) : (
                <>
                  {budget > 0 ? (
                    <>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percent}%`, background: color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="budget-status" style={{ color }}>{getStatus(percent)}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{percent.toFixed(0)}%</span>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No budget set</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetGoals;