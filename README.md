# Expense Tracker

A modern, sleek, and minimalist web application designed to help users track personal expenses, establish category budgets, and visualize spending habits through dynamic charts. This project serves as a comprehensive Personal Finance Dashboard, balancing complex front-end UI state with robust back-end CRUD operations and data aggregation.

## Live Demo Links
- **Frontend (Vercel):** [https://mini-expense-tracker-red.vercel.app/](https://mini-expense-tracker-red.vercel.app/)
- **Backend API (Render):** [https://mini-expense-backend.onrender.com](https://mini-expense-backend.onrender.com)
## Tech Stack
**Frontend:**
- **React (via Vite):** Chosen for its lightning-fast Hot Module Replacement (HMR) and highly optimized production builds.
- **Vanilla CSS:** Utilizes pure CSS with CSS Variables for theme management, demonstrating that complex, responsive layouts can be built from scratch without relying on bulky utility frameworks.
- **Recharts:** Selected for seamlessly rendering beautiful, responsive SVG charts to handle financial data visualization.
- **Lucide-React:** Used for clean, consistent, and lightweight vector icons.

**Backend:**
- **Node.js & Express:** Used to create a fast, unopinionated RESTful API.
- **Better-SQLite3:** Chosen as the database engine because it requires zero configuration or external database servers to run. It stores data locally, making the application incredibly simple to clone and run locally.
- **CORS:** Handles cross-origin requests between the Vite dev server and the Express API.

## How to Run Locally

To run this project on your machine, you will need to start both the backend server and the frontend client. Ensure you have **Node.js** installed.

**1. Start the Backend Server**
Open a terminal and run the following commands:
```bash
cd "Mini Expense Tracker/server"
npm install
npm run start
```
*The server will start running on `http://localhost:5000`. The SQLite database will be created automatically.*

**2. Start the Frontend Client**
Open a **new** terminal window and run:
```bash
cd "Mini Expense Tracker/client"
npm install
npm run dev
```
*The client will start running. Open your browser and navigate to the local port provided by Vite (typically `http://localhost:5173`).*

## API Documentation

### Expenses
- **`GET /api/expenses`**
  - **Description:** Retrieves all expenses, sorted by date descending.
  - **Query Params:** `category` (optional), `startDate` (optional), `endDate` (optional)
  - **Response:** `Array<{ id, amount, category, date, note, created_at }>`

- **`GET /api/expenses/summary`**
  - **Description:** Retrieves aggregated statistics for the dashboard views.
  - **Response:** `{ totalThisMonth: number, highestExpense: Object, categoryTotals: Array }`

- **`POST /api/expenses`**
  - **Description:** Creates a new expense record.
  - **Body:** `{ amount: number, category: string, date: string, note: string }`
  - **Response:** `{ id: number }` (Status 201)

- **`PUT /api/expenses/:id`**
  - **Description:** Updates an existing expense record.
  - **Body:** `{ amount: number, category: string, date: string, note: string }`
  - **Response:** `{ success: true }`

- **`DELETE /api/expenses/:id`**
  - **Description:** Deletes a specific expense.
  - **Response:** `{ success: true }`

### Budgets
- **`GET /api/budgets`**
  - **Description:** Retrieves all active category budgets.
  - **Response:** `Array<{ category: string, amount: number }>`

- **`POST /api/budgets`**
  - **Description:** Upserts (creates or updates) a budget limit for a category.
  - **Body:** `{ category: string, amount: number }`
  - **Response:** `{ success: true }`

## Project Structure
```text
Mini Expense Tracker/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Forms, Charts, Layouts)
│   │   ├── utils/              # API helpers and currency formatters
│   │   ├── App.jsx             # Main application routing and state
│   │   └── index.css           # Global vanilla CSS styles and theme variables
│   ├── package.json
│   └── vite.config.js          # Vite configuration
│
└── server/                     # Backend Express Application
    ├── database.js             # SQLite initialization and table schemas
    ├── server.js               # Express application and REST endpoints
    └── package.json
```

## Next Steps
While the core tracking, visualization, and CSV exporting mechanics are fully operational, the following features are planned for future iterations:
- **Authentication:** Currently, it acts as a single-user local application. Building a JWT-based authentication system would allow for multi-user cloud support.
- **Plaid API Integration:** The "Wallets & Banks" page is currently a UI mock. The next logical step would be to connect to real banking APIs using Plaid to automatically sync and categorize transactions.
