// src/pages/Suppliers.jsx
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Suppliers() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", contact: "" });

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/suppliers");
      setSuppliers(res.data);
    } catch {
      toast.error("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/suppliers", newSupplier);
      toast.success("Supplier added ✅");
      setNewSupplier({ name: "", contact: "" });
      fetchSuppliers();
    } catch {
      toast.error("Failed to add supplier");
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/suppliers/${id}`, editData);
      toast.success("Supplier updated ✅");
      setEditId(null);
      setEditData({ name: "", contact: "" });
      fetchSuppliers();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/suppliers/${id}`);
      toast.info("Supplier deleted");
      fetchSuppliers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Suppliers</h2>

        {/* ✅ Only admins can add suppliers */}
        {user?.role === "admin" && (
          <form style={styles.form} onSubmit={handleAdd}>
            <input type="text" placeholder="Supplier Name" value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              style={styles.input} required />
            <input type="text" placeholder="Contact Info" value={newSupplier.contact}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              style={styles.input} required />
            <button type="submit" style={styles.button}>Add Supplier</button>
          </form>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Contact</th>
              {user?.role === "admin" && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, idx) => (
              <tr key={s._id} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>
                  {editId === s._id ? (
                    <input type="text" value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      style={styles.input} />
                  ) : (s.name)}
                </td>
                <td style={styles.td}>
                  {editId === s._id ? (
                    <input type="text" value={editData.contact}
                      onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                      style={styles.input} />
                  ) : (s.contact)}
                </td>
                {user?.role === "admin" && (
                  <td style={styles.td}>
                    {editId === s._id ? (
                      <>
                        <button style={styles.saveBtn} onClick={() => saveEdit(s._id)}>Save</button>
                        <button style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button style={styles.editBtn} onClick={() => { setEditId(s._id); setEditData({ name: s.name, contact: s.contact }); }}>Edit</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(s._id)}>Delete</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
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
  td: { padding: "12px" },
  evenRow: { backgroundColor: "#f9f9f9" },
  oddRow: { backgroundColor: "#fff" },
  editBtn: { marginRight: "5px", padding: "6px 12px", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "4px" },
  saveBtn: { marginRight: "5px", padding: "6px 12px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px" },
  cancelBtn: { marginRight: "5px", padding: "6px 12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px" },
  deleteBtn: { padding: "6px 12px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" },
};

export default Suppliers;
