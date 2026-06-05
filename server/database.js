const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'expenses.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database table
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS budgets (
    category TEXT PRIMARY KEY,
    amount REAL NOT NULL
  )
`);

module.exports = db;
