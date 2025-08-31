
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // use the custom hook
import { useNavigate } from "react-router-dom";

function Alerts() {
  const { token } = useAuth(); // only need token
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("/products/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch alerts");
      }
    };

    fetchAlerts();
  }, [token, navigate]); // fetch alerts whenever token changes

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Low Stock Alerts</h2>

        {alerts.length === 0 ? (
          <div style={styles.noAlert}>No products are below reorder point 🎉</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Reorder Point</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, idx) => (
                  <tr
                    key={a._id}
                    style={{
                      ...styles.tr,
                      background: idx % 2 === 0 ? "#fdf2f2" : "#fff5f5",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                    }}
                  >
                    <td style={styles.td}>{a.name}</td>
                    <td style={styles.td}>{a.stock}</td>
                    <td style={styles.td}>{a.reorderPoint}</td>
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
    maxWidth: "900px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#c0392b",
    fontWeight: "600",
    fontSize: "24px",
  },
  noAlert: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "8px",
    background: "#d1fae5",
    color: "#065f46",
    fontWeight: "500",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    fontSize: "14px",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    background: "#b91c1c",
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
};
export default Alerts;
