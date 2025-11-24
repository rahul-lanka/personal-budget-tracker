import  { useEffect, useState } from "react";
// 1. Import useNavigate
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import type { Transaction } from "../types";
import API from "../api/    api";

export default function Transactions() {
  // 2. Initialize the hook
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);

  const fetchData = async (p = 1) => {
    try {
      const res = await API.get("transactions/", { params: { page: p } });
      // Handle pagination result vs list result safely
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setTransactions(data || []);
      
      setNext(res.data.next || null);
      setPrev(res.data.previous || null);
      setPage(p);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await API.delete(`transactions/${id}/`);
      fetchData(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* 3. Add the Back Button here */}
      <button 
        onClick={() => navigate("/")} 
        className="button" 
        style={{ marginBottom: "20px", backgroundColor: "#6c757d", color: "white" }}
      >
        ← Back to Dashboard
      </button>

      <h1 className="page-header">Transactions</h1>
      <div className="card">
        <h3 className="card-header">Add New Transaction</h3>
        <TransactionForm onSaved={() => fetchData(1)} />
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <h3 className="card-header">Transaction History</h3>
        <div style={{ overflowX: "auto" }}> {/* Added overflow for mobile friendliness */}
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td style={{ 
                    color: t.type === 'income' ? 'var(--success-color)' : 'var(--danger-color)',
                    fontWeight: 'bold',
                    textTransform: 'capitalize' 
                  }}>
                    {t.type}
                  </td>
                  <td>{t.category?.name ?? "-"}</td>
                  <td>${Number(t.amount).toLocaleString()}</td>
                  <td>{t.note ?? ""}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="button button-danger"
                      style={{ padding: "6px 10px", fontSize: "0.9rem" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button disabled={!prev} onClick={() => fetchData(page - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button disabled={!next} onClick={() => fetchData(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}