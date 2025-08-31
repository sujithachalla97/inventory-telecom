// src/pages/Transactions.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Transactions() {
  const { token } = useAuth(); // 🔑 get token from AuthContext
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch {
      toast.error("Failed to fetch transactions");
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Transactions</h2>

        {transactions.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>
            No transactions available.
          </p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product ID</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr
                    key={t._id}
                    style={{
                      ...styles.tr,
                      background: idx % 2 === 0 ? "#f8fafc" : "#fff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                    }}
                  >
                    <td style={styles.td}>{t.productId}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            t.type === "in"
                              ? "linear-gradient(90deg, #4ade80, #22c55e)"
                              : "linear-gradient(90deg, #facc15, #f59e0b)",
                        }}
                      >
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>{t.quantity}</td>
                    <td style={styles.td}>
                      {new Date(t.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    width: "100%",
    maxWidth: "1100px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontWeight: "600",
    fontSize: "24px",
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    fontSize: "14px",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    background: "#1f2937",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "8px",
  },
  tr: {
    transition: "all 0.3s",
    cursor: "pointer",
    borderRadius: "8px",
  },
  td: {
    padding: "12px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.3s",
  },
};

export default Transactions;
