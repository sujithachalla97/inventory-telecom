// src/pages/Managers.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Managers() {
  const { user } = useAuth();
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchManagers = useCallback(async () => {
    try {
      const res = await axios.get("/users/managers");
      setManagers(res.data);
    } catch {
      toast.error("Failed to fetch managers");
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/users/${editingId}`, formData);
        toast.success("Manager updated ✅");
        setEditingId(null);
      } else {
        await axios.post("/users/managers", formData);
        toast.success("Manager added ✅");
      }
      setFormData({ name: "", email: "", password: "" });
      fetchManagers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save manager");
    }
  };

  const handleEdit = (manager) => {
    setEditingId(manager._id);
    setFormData({ name: manager.name, email: manager.email, password: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      await axios.delete(`/users/${id}`);
      toast.info("Manager deleted");
      fetchManagers();
    } catch {
      toast.error("Failed to delete manager");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Managers</h2>

        {user?.role === "admin" && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder={editingId ? "New Password (optional)" : "Password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
              required={!editingId}
            />
            <button type="submit" style={styles.button}>
              {editingId ? "Update Manager" : "Add Manager"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", email: "", password: "" });
                }}
                style={{ ...styles.button, background: "#dc3545" }}
              >
                Cancel
              </button>
            )}
          </form>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              {user?.role === "admin" && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {managers.length > 0 ? (
              managers.map((m) => (
                <tr key={m._id} style={styles.tr}>
                  <td style={styles.td}>{m.name}</td>
                  <td style={styles.td}>{m.email}</td>
                  {user?.role === "admin" && (
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => handleEdit(m)}>
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(m._id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "15px" }}>
                  No managers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", background: "#f0f2f5", minHeight: "100vh", display: "flex", justifyContent: "center" },
  card: { width: "100%", maxWidth: "900px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "600", color: "#333" },
  form: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  input: { flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" },
  button: { padding: "10px 20px", border: "none", borderRadius: "6px", background: "#28a745", color: "#fff", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: { padding: "12px", textAlign: "left", background: "#343a40", color: "#fff" },
  tr: { borderBottom: "1px solid #ddd" },
  td: { padding: "12px" },
  editBtn: { marginRight: "8px", padding: "6px 12px", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "4px" },
  deleteBtn: { padding: "6px 12px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" },
};

export default Managers;
