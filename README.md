# Personal Budget Tracker

A full-stack web application to help users track their income, expenses, and monthly budgets with detailed visualizations.

---

## Features

- User authentication with JWT (login only, no registration)
- Add, edit, delete income and expense transactions
- Categorize transactions (e.g., salary, groceries, entertainment)
- View financial summary: total income, expenses, and balance
- Interactive dashboards with D3.js charts (pie & bar charts)
- Set and compare monthly budgets against actual expenses
- Transaction history with pagination and filtering by date, category, and amount

---

## Technology Stack

- **Backend:** Django, Django REST Framework, Simple JWT  
- **Frontend:** React, React Router, Axios, D3.js  
- **Database:** SQLite (default, easy to swap for production)  
- **Authentication:** JWT token-based authentication  

---

## Getting Started

### Prerequisites

- Python 3.10+  
- Node.js 16+ and npm or yarn  
- Git  

### Backend Setup

1. Clone the repository:  

2. Create and activate Python virtual environment:  

3. Install backend dependencies:  

4. Apply migrations and create superuser:  

5. Run the backend server:  

### Frontend Setup

1. Navigate to frontend directory (if separate):  

2. Install dependencies:  

3. Start React development server:  

---

## API Endpoints

- `/api/auth/login/` - Login with username & password to obtain JWT token  
- `/api/categories/` - CRUD categories  
- `/api/transactions/` - CRUD transactions with filtering, pagination  
- `/api/budgets/` - CRUD monthly budgets  
- `/api/transactions/summary/` - Get financial summary  
- `/api/budgets/compare_month/` - Get budget vs actual expenses for a month  

---

## Usage

- Visit `/login` to authenticate  
- Access dashboard for financial summaries and charts  
- Use Transactions page to add/edit/delete income or expenses  
- Track budgets monthly and compare with actual spending  

---

## License

This project is licensed under the MIT License.

---

## Contact

Developed by Rahul Lanka - [GitHub](https://github.com/rahul-lanka)

