import React, { useEffect, useState } from "react";
import type { BudgetCompare } from "../types";
import API from "../api/    api";

export default function Budget() {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [amount, setAmount] = useState("");
  const [compare, setCompare] = useState<BudgetCompare | null>(null);

  const fetchCompare = async (m = month) => {
    try {
      const res = await API.get(`budgets/compare_month/?month=${m}`);
      setCompare(res.data);
    } catch (err) {
      console.error(err);
      setCompare(null);
    }
  };

  useEffect(() => {
    if (month) fetchCompare();
  }, [month]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { month: `${month}-01`, amount };
      await API.post("budgets/", payload);
      fetchCompare();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save budget. Please check the console for details.");
    }
  };

  return (
    <div>
      <h1 className="page-header">Manage Budget</h1>
      <div className="card">
        <h3 className="card-header">Set Monthly Budget</h3>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="budget-month">Select Month</label>
              <input
                id="budget-month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="budget-amount">Budget Amount</label>
              <input
                id="budget-amount"
                type="number"
                placeholder="e.g., 2000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
                <button type="submit" className="button button-primary">Save Budget</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 className="card-header">Monthly Comparison for {month}</h3>
        {compare && compare.budget > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', padding: '8px 0' }}>
              <span>Budget:</span>
              <strong>${Number(compare.budget).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', padding: '8px 0' }}>
              <span>Actual:</span>
              <strong>${Number(compare.actual_expenses).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', padding: '8px 0', color: Number(compare.remaining) < 0 ? 'var(--danger-color)' : 'var(--success-color)'}}>
              <span>Remaining:</span>
              <strong>${Number(compare.remaining).toLocaleString()}</strong>
            </div>
          </>
        ) : (
          <p>No budget data for the selected month.</p>
        )}
      </div>
    </div>
  );
}