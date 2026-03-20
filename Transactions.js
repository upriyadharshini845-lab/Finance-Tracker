import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../common/Toast';
import TransactionModal from './TransactionModal';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

const Transactions = () => {
  const { transactions, loading, totalBalance, totalIncome, totalExpense, deleteTransaction } = useTransactions();
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setContextMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
  }, [transactions, search]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteTransaction(confirmDelete._id);
    setConfirmDelete(null);
    addToast('Transaction deleted!', 'error');
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Manage your income and expenses</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="export-btn export-excel" onClick={() => { exportToExcel(transactions); addToast('Exported to Excel!', 'success'); }}>
            📥 Excel
          </button>
          <button className="export-btn export-pdf" onClick={() => { exportToPDF(transactions); addToast('PDF report opened!', 'info'); }}>
            📄 PDF
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingTx(null); setShowModal(true); }}>
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card kpi-gradient-balance">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.2)' }}>💰</div>
          <div>
            <div className="stat-label">Total Balance</div>
            <div className="stat-value" style={{ color: totalBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              ${Math.abs(totalBalance).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="stat-card kpi-gradient-income">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.2)' }}>📈</div>
          <div>
            <div className="stat-label">Total Income</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>${totalIncome.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card kpi-gradient-expense">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>📉</div>
          <div>
            <div className="stat-label">Total Expense</div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>${totalExpense.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="transactions-table-section">
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">All Transactions</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Search */}
              <div className="search-bar">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSearch('')}>×</span>
                )}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} records</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    {['Title', 'Amount', 'Type', 'Category', 'Date', 'Note', ''].map((h) => (
                      <th key={h} style={{ background: '#1a2545', color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={7}>
                        {search ? `No results for "${search}"` : 'No transactions yet. Click "Add Transaction" to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx) => (
                      <tr key={tx._id}>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{tx.title}</td>
                        <td style={{ color: tx.type === 'Income' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                        <td>
                          <span className={`type-badge ${tx.type === 'Income' ? 'income-badge' : 'expense-badge'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td>{tx.category}</td>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{tx.note || '-'}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 16 }}
                            onClick={(e) => setContextMenu({ x: e.clientX, y: e.clientY, tx })}
                          >
                            ⋮
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div ref={menuRef} className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x, position: 'fixed' }}>
          <button className="context-menu-item" onClick={() => { setEditingTx(contextMenu.tx); setShowModal(true); setContextMenu(null); }}>
            ✏️ Edit
          </button>
          <button className="context-menu-item danger" onClick={() => { setConfirmDelete(contextMenu.tx); setContextMenu(null); }}>
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Delete Transaction</span>
              <button className="close-btn" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Are you sure you want to delete <strong>"{confirmDelete.title}"</strong>? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTx}
          onClose={() => { setShowModal(false); setEditingTx(null); }}
          onSuccess={(msg) => addToast(msg, 'success')}
        />
      )}
    </div>
  );
};

export default Transactions;