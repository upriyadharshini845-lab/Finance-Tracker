const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const { dateRange } = req.query;
    let dateFilter = {};
    const now = new Date();
    if (dateRange === 'today') {
      const start = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { date: { $gte: start } };
    } else if (dateRange === 'last7') {
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { date: { $gte: start } };
    } else if (dateRange === 'last30') {
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { date: { $gte: start } };
    } else if (dateRange === 'last90') {
      const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      dateFilter = { date: { $gte: start } };
    }
    const transactions = await Transaction.find(dateFilter).sort({ date: -1 });
    res.json({ success: true, data: transactions, count: transactions.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    const errors = {};
    if (!title || title.trim() === '') errors.title = 'Please fill the field';
    if (!amount || isNaN(amount)) errors.amount = 'Please fill the field';
    if (!type) errors.type = 'Please fill the field';
    if (!category) errors.category = 'Please fill the field';
    if (!date) errors.date = 'Please fill the field';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const transaction = new Transaction({ title, amount, type, category, date, note });
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    const errors = {};
    if (!title || title.trim() === '') errors.title = 'Please fill the field';
    if (!amount || isNaN(amount)) errors.amount = 'Please fill the field';
    if (!type) errors.type = 'Please fill the field';
    if (!category) errors.category = 'Please fill the field';
    if (!date) errors.date = 'Please fill the field';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, category, date, note },
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;