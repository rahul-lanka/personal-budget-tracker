import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
// import Categories from './pages/Categories';
import './index.css'; // Use the global CSS file
import type { JSX } from 'react';
import Categories from './pages/Categories';

// Helper to check for auth token
const isAuthenticated = () => !!localStorage.getItem('access_token');

// A component that protects routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// The main layout with sidebar
const AppLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-header">Budget Tracker</div>
        <ul className="sidebar-nav">
          <li><NavLink to="/" className="nav-link">Dashboard</NavLink></li>
          <li><NavLink to="/transactions" className="nav-link">Transactions</NavLink></li>
          <li><NavLink to="/budget" className="nav-link">Budget</NavLink></li>
          <li><NavLink to="/categories" className="nav-link">Categories</NavLink></li>
        </ul>
        <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
    </div>
  );
};

// The main App component that handles routing logic
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}