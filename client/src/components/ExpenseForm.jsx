import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const ExpenseForm = ({ initialData, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [category, setCategory] = useState(initialData ? initialData.category : '');
  const [date, setDate] = useState(initialData ? initialData.date : new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note || '');
    } else {
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (inputDate > today) {
      setError('Date cannot be in the future');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: parsedAmount,
        category,
        date,
        note,
      });
      if (!initialData) {
        setAmount('');
        setCategory('');
        setNote('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ position: 'relative' }}>
      <button 
        className="btn-icon" 
        onClick={onCancel}
        style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        aria-label="Close form"
      >
        <X size={20} />
      </button>
      
      <h2 className="text-xl title-gradient mb-4">
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {error && <div className="badge mb-4 text-danger" style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)', background: 'rgba(230, 57, 70, 0.1)' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (Optional)</label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn-danger" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
