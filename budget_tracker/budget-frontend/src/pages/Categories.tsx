import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/    api";

type Category = {
  id: number;
  name: string;
};

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories from Backend
  const fetchCategories = async () => {
    try {
      const res = await API.get("categories/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Adding a new Category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await API.post("categories/", { name });
      setName(""); 
      fetchCategories(); 
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting a Category
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This will not delete transactions associated with this category, but they will lose their category label.")) return;
    
    try {
      await API.delete(`categories/${id}/`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")} 
        className="button" 
        style={{ marginBottom: "20px", backgroundColor: "#6c757d", color: "white" }}
      >
        ← Back to Dashboard
      </button>

      <h1 className="page-header">Manage Categories</h1>

      <div className="grid">
        {/* Left Column: Add New Category */}
        <div className="grid-item md-4">
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 className="card-header">Add Category</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Groceries, Rent" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="button button-primary" 
                style={{ marginTop: "16px", width: "100%" }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List Existing Categories */}
        <div className="grid-item md-6">
          <div className="card">
            <h3 className="card-header">Existing Categories</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="button button-danger"
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", color: "#888" }}>
                      No categories found. Add one on the left!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}