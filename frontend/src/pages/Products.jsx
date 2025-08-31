// src/pages/Products.jsx
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", stock: 0, reorderPoint: 0 });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, newProduct);
        toast.success("Product updated ✅");
        setEditingId(null);
      } else {
        await axios.post("/products", newProduct);
        toast.success("Product added ✅");
      }
      setNewProduct({ name: "", category: "", stock: 0, reorderPoint: 0 });
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      toast.info("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      category: product.category,
      stock: product.stock,
      reorderPoint: product.reorderPoint,
    });
  };

  const handleTransaction = async (id, type) => {
    const qty = parseInt(prompt(`Enter quantity to ${type}:`), 10);
    if (!qty || qty <= 0) return;
    try {
      await axios.post("/transactions", { productId: id, type, quantity: qty });
      toast.info(`Stock ${type} successful`);
      fetchProducts();
    } catch {
      toast.error("Transaction failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Products</h2>

        {/* ✅ Only admins can add/edit products */}
        {user?.role === "admin" && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              style={styles.input} required />
            <input type="text" placeholder="Category" value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              style={styles.input} required />
            <input type="number" min="0" placeholder="Stock" value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              style={styles.input} required />
            <input type="number" min="0" placeholder="Reorder Point" value={newProduct.reorderPoint}
              onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
              style={styles.input} required />
            <button type="submit" style={styles.button}>{editingId ? "Update Product" : "Add Product"}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setNewProduct({ name: "", category: "", stock: 0, reorderPoint: 0 }); }}
                style={{ ...styles.button, background: "#dc3545" }}>Cancel</button>
            )}
          </form>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Reorder Point</th>
              {(user?.role === "admin" || user?.role === "manager") && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={p.stock < p.reorderPoint ? styles.lowStockRow : {}}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>{p.reorderPoint}</td>
                {(user?.role === "admin" || user?.role === "manager") && (
                  <td style={styles.td}>
                    {user?.role !== "staff" && (
                      <>
                        <button style={styles.stockInBtn} onClick={() => handleTransaction(p._id, "in")}>Stock In</button>
                        <button style={styles.stockOutBtn} onClick={() => handleTransaction(p._id, "out")}>Stock Out</button>
                      </>
                    )}
                    {user?.role === "admin" && (
                      <>
                        <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
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
  card: { width: "100%", maxWidth: "1100px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "600", color: "#333" },
  form: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  input: { flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" },
  button: { padding: "10px 20px", border: "none", borderRadius: "6px", background: "#28a745", color: "#fff", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: { padding: "12px", textAlign: "left", background: "#343a40", color: "#fff" },
  td: { padding: "12px" },
  lowStockRow: { background: "#fdecea" },
  stockInBtn: { marginRight: "5px", padding: "6px 12px", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "4px" },
  stockOutBtn: { marginRight: "5px", padding: "6px 12px", background: "#ffc107", color: "#fff", border: "none", borderRadius: "4px" },
  editBtn: { marginRight: "5px", padding: "6px 12px", background: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px" },
  deleteBtn: { padding: "6px 12px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" },
};

export default Products;
