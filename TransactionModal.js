import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';

const CATEGORIES = ['Food','Rent','Salary','Bills','Transport','Shopping','Health','Entertainment','Other'];

const initialForm = {
  title: '', amount: '', type: 'Expense',
  category: 'Food', date: new Date().toISOString().split('T')[0], note: '',
};

const TransactionModal = ({ transaction, onClose, onSuccess }) => {
    const { addTransaction, updateTransaction } = useTransactions();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title || '',
        amount: transaction.amount || '',
        type: transaction.type || 'Expense',
        category: transaction.category || 'Food',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : initialForm.date,
        note: transaction.note || '',
      });
    }
  }, [transaction]);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Please fill the field';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Please fill the field';
    if (!form.type) e.type = 'Please fill the field';
    if (!form.category) e.category = 'Please fill the field';
    if (!form.date) e.date = 'Please fill the field';
    return e;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (isEdit) await updateTransaction(transaction._id, payload);
      else await addTransaction(payload);
onSuccess(isEdit ? 'Transaction updated! ✏️' : 'Transaction added! ✅');
      onClose();
        } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      if (Object.keys(serverErrors).length > 0) setErrors(serverErrors);
      else setErrors({ general: err.response?.data?.error || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {errors.general && (
            <div style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)' }}>
              {errors.general}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Type *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Income','Expense'].map((t) => (
                <button key={t} type="button" onClick={() => set('type', t)} style={{
                  flex: 1, padding: '9px', borderRadius: 8,
                  border: `1px solid ${form.type === t ? (t === 'Income' ? 'var(--success)' : 'var(--danger)') : 'var(--border)'}`,
                  background: form.type === t ? (t === 'Income' ? 'var(--success-glow)' : 'var(--danger-glow)') : 'var(--bg-secondary)',
                  color: form.type === t ? (t === 'Income' ? 'var(--success)' : 'var(--danger)') : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                }}>
                  {t === 'Income' ? '📈' : '📉'} {t}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input type="text" className="form-control" placeholder="e.g. Monthly Rent" value={form.title}
              onChange={(e) => set('title', e.target.value)} style={errors.title ? { borderColor: 'var(--danger)' } : {}} />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Amount ($) *</label>
              <input type="number" className="form-control" placeholder="0.00" min="0.01" step="0.01" value={form.amount}
                onChange={(e) => set('amount', e.target.value)} style={errors.amount ? { borderColor: 'var(--danger)' } : {}} />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-control" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input type="date" className="form-control" value={form.date} onChange={(e) => set('date', e.target.value)}
              style={errors.date ? { borderColor: 'var(--danger)' } : {}} />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <textarea className="form-control" placeholder="Add a note..." rows={2} value={form.note}
              onChange={(e) => set('note', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? '✅ Update' : '✅ Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;