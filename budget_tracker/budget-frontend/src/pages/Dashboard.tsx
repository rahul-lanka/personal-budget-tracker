import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import D3Chart from "../components/D3Chart";
import API from "../api/    api";

export default function Dashboard() {
  const navigate = useNavigate(); 

  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [budgetCompare, setBudgetCompare] = useState<any | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const s = await API.get("transactions/summary/");
        setSummary({
          income: Number(s.data.income || 0),
          expenses: Number(s.data.expenses || 0),
          balance: Number(s.data.balance || 0),
        });

        const today = new Date();
        const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
        const b = await API.get(`budgets/compare_month/?month=${month}`);
        setBudgetCompare(b.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const pieChartData = [
    { label: "Income", value: summary.income > 0 ? summary.income : 1 },
    { label: "Expenses", value: summary.expenses },
  ];

  return (
    <div>
      <h1 className="page-header">Dashboard</h1>

      {/* Add this button for navigation */}
      <button
        onClick={() => navigate("/transactions")}
        style={{ marginBottom: "16px", padding: "8px 16px", cursor: "pointer" }}
      >
        Add Income / Expense
      </button>

      <div className="grid">
        <div className="grid-item md-4">
          <div className="card">
            <h3>Income</h3>
            <p className="summary-value" style={{ color: "var(--success-color)" }}>
              ${summary.income.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="grid-item md-4">
          <div className="card">
            <h3>Expenses</h3>
            <p className="summary-value" style={{ color: "var(--danger-color)" }}>
              ${summary.expenses.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="grid-item md-4">
          <div className="card">
            <h3>Balance</h3>
            <p className="summary-value">${summary.balance.toLocaleString()}</p>
          </div>
        </div>
        <div className="grid-item md-6">
          <div className="card">
            <h3 className="card-header">Income vs Expenses</h3>
            <D3Chart data={pieChartData} type="pie" />
          </div>
        </div>
        <div className="grid-item md-6">
          <div className="card">
            <h3 className="card-header">Budget vs Actual (This Month)</h3>
            {budgetCompare && budgetCompare.budget > 0 ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", padding: "8px 0" }}>
                  <span>Budget:</span>
                  <strong>${Number(budgetCompare.budget).toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", padding: "8px 0" }}>
                  <span>Actual:</span>
                  <strong>${Number(budgetCompare.actual_expenses).toLocaleString()}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.1rem",
                    padding: "8px 0",
                    color: Number(budgetCompare.remaining) < 0 ? "var(--danger-color)" : "var(--success-color)",
                  }}
                >
                  <span>Remaining:</span>
                  <strong>${Number(budgetCompare.remaining).toLocaleString()}</strong>
                </div>
                <D3Chart
                  data={[
                    { label: "Budget", value: Number(budgetCompare.budget) },
                    { label: "Actual", value: Number(budgetCompare.actual_expenses) },
                  ]}
                  type="bar"
                />
              </>
            ) : (
              <p>No budget has been set for this month.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
