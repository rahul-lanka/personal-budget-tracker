import React, { useEffect, useState } from "react";
import API from "../api/    api";

type Props = { onSaved?: () => void };

export default function TransactionForm({ onSaved }: Props) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("categories/");
        setCategories(res.data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("transactions/", {
        type,
        amount,
        note,
        date,
        category_id: categoryId || null
      });
      setAmount("");
      setNote("");
      setCategoryId("");
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, padding: 8, border: "1px solid #ddd" }}>
      <div>
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label>Amount</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>

      <div>
        <label>Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}>
          <option value="">-- None --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <label>Note</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div style={{ marginTop: 8 }}>
        <button type="submit">Add Transaction</button>
      </div>
    </form>
  );
}
