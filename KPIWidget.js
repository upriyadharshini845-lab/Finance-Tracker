import React from 'react';
import { useTransactions } from '../../context/TransactionContext';

const ICONS = {
  totalBalance: { icon: '💰', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  totalIncome:  { icon: '📈', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  totalExpense: { icon: '📉', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  totalAmount:  { icon: '💵', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  amount:       { icon: '🔢', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
};

const KPIWidget = ({ config }) => {
  const { transactions, totalBalance, totalIncome, totalExpense } = useTransactions();

  const computeValue = () => {
    if (config.metric === 'totalBalance') return totalBalance;
    if (config.metric === 'totalIncome') return totalIncome;
    if (config.metric === 'totalExpense') return totalExpense;
    const values = transactions.map((t) => t.amount || 0);
    if (values.length === 0) return 0;
    if (config.aggregation === 'Sum') return values.reduce((a, b) => a + b, 0);
    if (config.aggregation === 'Average') return values.reduce((a, b) => a + b, 0) / values.length;
    if (config.aggregation === 'Count') return values.length;
    return 0;
  };

  const formatValue = (val) => {
    const precision = config.decimalPrecision ?? 2;
    if (config.dataFormat === 'Currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: precision, maximumFractionDigits: precision }).format(val);
    }
    return val.toFixed(precision);
  };

  const value = computeValue();
  const iconData = ICONS[config.metric] || ICONS.amount;

  return (
    <div className="kpi-widget">
      <div className="kpi-header">
        <span className="kpi-title">{config.title || 'KPI Card'}</span>
        <div className="kpi-icon" style={{ background: iconData.bg }}>{iconData.icon}</div>
      </div>
      <div>
        <div className="kpi-value" style={{ color: iconData.color }}>{formatValue(value)}</div>
        {config.description && <div className="kpi-desc">{config.description}</div>}
        <div className="kpi-desc" style={{ marginTop: 4 }}>{config.aggregation} · {transactions.length} records</div>
      </div>
    </div>
  );
};

export default KPIWidget;