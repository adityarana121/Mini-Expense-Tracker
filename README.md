# Mini Expense Tracker

This project is a full-stack Mini Expense Tracker application. It allows users to log their daily spending across various categories, set category-specific budgets, edit/delete expenses, filter by date and category, export their data to CSV, and view a visual summary of where their money is going. 

## Live Demo Links
- **Frontend (Deployed)**: [Insert Frontend URL Here]
- **Backend (Deployed)**: [Insert Backend URL Here]

## Tech Stack
- **Frontend**: React (Vite) & JavaScript. Used for a fast, modern component-based UI.
  - *Recharts*: Selected for lightweight, responsive, and animated data visualization (Pie Chart).
  - *Lucide React*: Used for clean, modern iconography.
  - *Axios*: Used for simplified and promise-based HTTP requests.
  - *Vanilla CSS*: Used over Tailwind/libraries to demonstrate strong fundamental CSS knowledge, implementing custom properties for theming, responsive grids, and modern glassmorphism.
- **Backend**: Node.js & Express. Chosen for its simplicity, speed, and seamless full-stack JavaScript integration.
  - *better-sqlite3*: Chosen for database persistence because it's the fastest, simplest synchronous SQLite wrapper, eliminating the need for a separate database server setup for this mini-project.
  - *cors*: To handle Cross-Origin Resource Sharing when the frontend is deployed separately from the backend.

## How to Run Locally

### Prerequisites
- Node.js installed (v18+ recommended)

### 1. Start the Backend
Open a terminal, navigate to the server folder, install dependencies, and run:
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`. It automatically creates a local `expenses.db` file.

### 2. Start the Frontend
Open a new terminal, navigate to the client folder, install dependencies, and run:
```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`. Open this URL in your browser.

### 3. Run with Docker (Optional)
If you have Docker installed, you can spin up the entire full-stack application with a single command from the root directory:
```bash
docker-compose up --build
```
This will start the backend on port `5000` and serve the frontend on port `80`. Open `http://localhost` in your browser.

## API Documentation

### `GET /api/expenses`
Retrieves a list of all expenses.
- **Query Parameters**: `category`, `startDate`, `endDate` (all optional).
- **Response**: `[ { "id": 1, "amount": 50, "category": "Food", "date": "2023-10-15", "note": "Lunch", "created_at": "..." } ]`

### `GET /api/expenses/summary`
Retrieves aggregated summary data.
- **Response**: `{ "totalThisMonth": 150.50, "highestExpense": { ... }, "categoryTotals": [ { "category": "Food", "total": 100 } ] }`

### `POST /api/expenses`
Create a new expense.
- **Request Body**: `{ "amount": 50, "category": "Food", "date": "2023-10-15", "note": "Lunch" }`
- **Response**: `{ "id": 1 }`

### `PUT /api/expenses/:id`
Update an existing expense.
- **Request Body**: `{ "amount": 60, "category": "Food", "date": "2023-10-15", "note": "Dinner" }`
- **Response**: `{ "success": true }`

### `DELETE /api/expenses/:id`
Delete an expense.
- **Response**: `{ "success": true }`

### `GET /api/budgets`
Retrieves all category budgets.
- **Response**: `[ { "category": "Food", "amount": 500 } ]`

### `POST /api/budgets`
Create or update a budget limit for a category.
- **Request Body**: `{ "category": "Food", "amount": 500 }`
- **Response**: `{ "success": true }`

## Project Structure
```text
/
├── client/                 # Frontend React Application
│   ├── index.html          # HTML entry point
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite build & proxy config
│   └── src/
│       ├── main.jsx        # React root rendering
│       ├── App.jsx         # Main application layout and state
│       ├── index.css       # Global styles (glassmorphism, variables)
│       ├── components/     # React components (ExpenseForm, Chart, BudgetOverview, etc.)
│       └── utils/          # Helper modules (api.js, format.js)
│
├── server/                 # Backend Express Application
│   ├── package.json        # Backend dependencies
│   ├── server.js           # Express app & API routes
│   └── database.js         # SQLite connection & table setup
│
└── README.md               # Project documentation
```

## Next Steps
While I completed all the core requirements and the bonus features (CSV Export, SQLite Persistence, and Category Budgets), there are a few things I would build next with more time:
- **Authentication/Users**: Adding JWT authentication so multiple users could have isolated expense trackers.
- **Unit Testing**: Implementing a test suite with Vitest and React Testing Library to cover edge cases in form validation and data aggregation.
- **Advanced Filtering**: Allowing users to filter by exact amount ranges or search by text inside the `note` field.
- **Pagination**: As the SQLite database grows, implementing cursor-based pagination on the `GET /api/expenses` endpoint to prevent performance degradation on the frontend.
