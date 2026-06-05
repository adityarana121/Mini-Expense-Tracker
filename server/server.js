const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes

// 1. Get all expenses (with optional filtering)
app.get('/api/expenses', (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, id DESC';
    
    const stmt = db.prepare(query);
    const expenses = stmt.all(...params);
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
});

// 2. Get summary data
app.get('/api/expenses/summary', (req, res) => {
  try {
    const now = new Date();
    const currentMonthPrefix = now.toISOString().slice(0, 7); // 'YYYY-MM'

    // Total spent this month
    const monthlyTotalStmt = db.prepare(`
      SELECT SUM(amount) as total 
      FROM expenses 
      WHERE date LIKE ?
    `);
    const monthlyTotalResult = monthlyTotalStmt.get(`${currentMonthPrefix}%`);
    const totalThisMonth = monthlyTotalResult?.total || 0;

    // Highest single expense
    const highestExpenseStmt = db.prepare(`
      SELECT * FROM expenses ORDER BY amount DESC LIMIT 1
    `);
    const highestExpense = highestExpenseStmt.get() || null;

    // Total per category
    const categoryTotalsStmt = db.prepare(`
      SELECT category, SUM(amount) as total 
      FROM expenses 
      GROUP BY category
    `);
    const categoryTotals = categoryTotalsStmt.all();

    res.json({
      totalThisMonth,
      highestExpense,
      categoryTotals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve summary' });
  }
});

// 3. Create a new expense
app.post('/api/expenses', (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    // Check future date
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (inputDate > today) {
      return res.status(400).json({ error: 'Date cannot be in the future' });
    }

    const stmt = db.prepare(`
      INSERT INTO expenses (amount, category, date, note)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(amount, category, date, note || null);
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// 4. Update an expense
app.put('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const stmt = db.prepare(`
      UPDATE expenses 
      SET amount = ?, category = ?, date = ?, note = ?
      WHERE id = ?
    `);
    const result = stmt.run(amount, category, date, note || null, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// 5. Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// 6. Get all budgets
app.get('/api/budgets', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM budgets');
    const budgets = stmt.all();
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve budgets' });
  }
});

// 7. Upsert a budget
app.post('/api/budgets', (req, res) => {
  try {
    const { category, amount } = req.body;
    
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (amount === undefined || amount < 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const stmt = db.prepare(`
      INSERT INTO budgets (category, amount)
      VALUES (?, ?)
      ON CONFLICT(category) DO UPDATE SET amount = excluded.amount
    `);
    stmt.run(category, amount);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// Serve static frontend files in production
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
