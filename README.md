# Stock Management System (SMS)

## StockHub Ltd - Kigali, Rwanda

A full-stack web application for managing products, warehouses, stock transactions, and inventory reporting.

### Tech Stack

- **Frontend:** React.js, React Router DOM, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication
- **Architecture:** MVC (Model-View-Controller)

### Features

- JWT Authentication (Login/Logout)
- Product Management (Create, Read)
- Warehouse Management (Create, Read)
- Stock Transaction Management (CRUD)
- Reports (Daily, Weekly, Monthly, Available Stock, Stock In, Stock Out)
- Responsive Dashboard with Statistics
- Protected Routes

### Default Login

- **Username:** admin
- **Password:** password

### Setup Instructions

#### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm

#### Backend Setup

```bash
cd backend-project
npm install
npm run seed    # Create admin user
npm run dev     # Start server on http://localhost:5001
```

#### Frontend Setup

```bash
cd frontend-project
npm install
npm run dev     # Start on http://localhost:5173
```

### API Endpoints

#### Auth
- POST /api/auth/login
- GET /api/auth/profile

#### Products
- POST /api/products
- GET /api/products

#### Warehouses
- POST /api/warehouses
- GET /api/warehouses

#### Transactions
- POST /api/transactions
- GET /api/transactions
- GET /api/transactions/:id
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

#### Reports
- GET /api/transactions/reports/dashboard
- GET /api/transactions/reports/daily?date=YYYY-MM-DD
- GET /api/transactions/reports/weekly?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
- GET /api/transactions/reports/monthly?year=2026&month=1
- GET /api/transactions/reports/available-stock
- GET /api/transactions/reports/stock-in?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
- GET /api/transactions/reports/stock-out?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

### Folder Structure

```
FirstName_LastName_National_Practical_Exam_2026
├── backend-project
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/authMiddleware.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend-project
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── routes/ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```
