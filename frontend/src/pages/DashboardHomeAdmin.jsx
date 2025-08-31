// src/pages/DashboardHomeAdmin.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../context/AuthContext";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function DashboardHomeAdmin() {
  const { token, user } = useAuth(); // 🔑 get token + user
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch all dashboard data
  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [pRes, sRes, tRes, aRes] = await Promise.all([
        axios.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/suppliers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/products/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProducts(pRes.data);
      setSuppliers(sRes.data);
      setTransactions(tRes.data);
      setAlerts(aRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transactions in the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString();
  }).reverse();

  const transactionsData = last7Days.map(
    (day) =>
      transactions.filter(
        (t) => new Date(t.date).toLocaleDateString() === day
      ).length
  );

  // Products per supplier
  const productsPerSupplier = suppliers.map(
    (s) => products.filter((p) => p.supplierId === s._id).length
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <h2>Welcome, {user?.name || "Admin"} 👋</h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Card label="Total Products" value={products.length} color="#0d6efd" />
        <Card label="Low Stock Alerts" value={alerts.length} color="#dc3545" />
        <Card label="Total Suppliers" value={suppliers.length} color="#28a745" />
        <Card
          label="Transactions Today"
          value={
            transactions.filter(
              (t) =>
                new Date(t.date).toLocaleDateString() ===
                new Date().toLocaleDateString()
            ).length
          }
          color="#ffc107"
        />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* Bar Chart: Product Stock vs Reorder Point */}
        <div
          style={{
            flex: "1 1 400px",
            minHeight: "300px",
            padding: "20px",
            background: "#fff",
            borderRadius: "12px",
          }}
        >
          <Bar
            data={{
              labels: products.map((p) => p.name),
              datasets: [
                {
                  label: "Stock",
                  data: products.map((p) => p.stock),
                  backgroundColor: "#0d6efd",
                },
                {
                  label: "Reorder Point",
                  data: products.map((p) => p.reorderPoint),
                  backgroundColor: "#dc3545",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Product Stock vs Reorder Point" },
              },
            }}
          />
        </div>

        {/* Line Chart: Transactions last 7 days */}
        <div
          style={{
            flex: "1 1 400px",
            minHeight: "300px",
            padding: "20px",
            background: "#fff",
            borderRadius: "12px",
          }}
        >
          <Line
            data={{
              labels: last7Days,
              datasets: [
                {
                  label: "Transactions",
                  data: transactionsData,
                  borderColor: "#28a745",
                  backgroundColor: "rgba(40,167,69,0.2)",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Transactions Last 7 Days" },
              },
            }}
          />
        </div>

        {/* Pie Chart: Products per Supplier */}
        <div
          style={{
            flex: "1 1 400px",
            minHeight: "300px",
            padding: "20px",
            background: "#fff",
            borderRadius: "12px",
          }}
        >
          <Pie
            data={{
              labels: suppliers.map((s) => s.name),
              datasets: [
                {
                  label: "Products",
                  data: productsPerSupplier,
                  backgroundColor: suppliers.map(
                    (_, i) => `hsl(${(i * 50) % 360}, 70%, 50%)`
                  ),
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Products per Supplier" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Reusable summary card
function Card({ label, value, color }) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        padding: "20px",
        borderRadius: "12px",
        background: color,
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "18px", marginBottom: "10px" }}>{label}</div>
      <div style={{ fontSize: "28px" }}>{value}</div>
    </div>
  );
}

export default DashboardHomeAdmin;
