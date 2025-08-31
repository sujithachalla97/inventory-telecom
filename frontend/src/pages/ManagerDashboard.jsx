// src/pages/ManagerDashboard.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosInstance";
import { Bar, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ManagerDashboard() {
  const { token, user } = useAuth(); // ✅ get token + user
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [prodRes, txnRes] = await Promise.all([
        axios.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProducts(prodRes.data);
      setTransactions(txnRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Product stock chart
  const productStockData = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Stock",
        data: products.map((p) => p.stock),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Reorder Point",
        data: products.map((p) => p.reorderPoint),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Transactions grouped by date
  const dates = [
    ...new Set(transactions.map((t) => new Date(t.date).toLocaleDateString())),
  ];
  const stockIn = dates.map(
    (d) =>
      transactions
        .filter((t) => new Date(t.date).toLocaleDateString() === d && t.type === "in")
        .reduce((sum, t) => sum + t.quantity, 0)
  );
  const stockOut = dates.map(
    (d) =>
      transactions
        .filter((t) => new Date(t.date).toLocaleDateString() === d && t.type === "out")
        .reduce((sum, t) => sum + t.quantity, 0)
  );

  const transactionsData = {
    labels: dates,
    datasets: [
      {
        label: "Stock In",
        data: stockIn,
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Stock Out",
        data: stockOut,
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        Welcome, {user?.name || "Manager"} 👋
      </h2>

      <div style={{ marginBottom: "40px", background: "#fff", padding: "20px", borderRadius: "12px" }}>
        <h4>📦 Product Stock Overview</h4>
        <Bar
          data={productStockData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Products vs Reorder Points" },
            },
          }}
        />
      </div>

      <div style={{ marginBottom: "40px", background: "#fff", padding: "20px", borderRadius: "12px" }}>
        <h4>📊 Recent Transactions</h4>
        <Line
          data={transactionsData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Stock In/Out by Date" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default ManagerDashboard;
