import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';

const COLUMN_LABELS = { title: 'Title', amount: 'Amount', type: 'Type', category: 'Category', date: 'Date', note: 'Note' };

const formatCell = (col, val) => {
  if (col === 'amount') return `$${Number(val).toFixed(2)}`;
  if (col === 'date') return new Date(val).toLocaleDateString();
  if (col === 'type') return <span className={`type-badge ${val === 'Income' ? 'income-badge' : 'expense-badge'}`}>{val}</span>;
  return val ?? '-';
};

const TableWidget = ({ config }) => {
  const { transactions } = useTransactions();
  const [page, setPage] = useState(1);

  const columns = config.columns?.length ? config.columns : ['title', 'amount', 'type', 'category', 'date'];
  const perPage = config.pagination || 10;

  const sorted = useMemo(() => {
    let data = [...transactions];
    if (config.sortBy === 'asc') data.sort((a, b) => a.amount - b.amount);
    else if (config.sortBy === 'desc') data.sort((a, b) => b.amount - a.amount);
    else data.sort((a, b) => new Date(b.date) - new Date(a.date));
    return data;
  }, [transactions, config.sortBy]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="table-widget">
      <div className="widget-title-bar">
        <div>
          <div className="widget-title">{config.title || 'Table'}</div>
          {config.description && <div className="widget-desc">{config.description}</div>}
        </div>
      </div>
      <div className="table-scroll" style={{ fontSize: config.fontSize || 14 }}>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} style={{ background: config.headerBg || '#6366f1' }}>{COLUMN_LABELS[col] || col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0
              ? <tr className="empty-row"><td colSpan={columns.length}>No transactions found</td></tr>
              : paginated.map((t) => (
                  <tr key={t._id}>
                    {columns.map((col) => <td key={col}>{formatCell(col, t[col])}</td>)}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="table-pagination">
          <span>{sorted.length} records</span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWidget;