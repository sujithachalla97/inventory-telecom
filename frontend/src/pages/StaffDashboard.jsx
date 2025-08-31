// src/pages/StaffDashboard.jsx
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StaffDashboard = () => {
  const { token, user } = useAuth(); // 🔑 staff info
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [tRes, aRes] = await Promise.all([
          axios.get("/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/products/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTransactions(tRes.data);
        setAlerts(aRes.data);
      } catch (err) {
        toast.error("Failed to load staff dashboard data");
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  // Transactions per month (last 5 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const transactionCounts = months.map(
    (m) =>
      transactions.filter(
        (t) =>
          new Date(t.date).toLocaleString("default", { month: "short" }) === m
      ).length
  );

  // Alerts grouped by severity
  const severityLevels = ["Critical", "High", "Medium", "Low"];
  const alertsSummary = severityLevels.map(
    (level) => alerts.filter((a) => a.severity === level).length
  );

  const transactionsData = {
    labels: months,
    datasets: [
      {
        label: "Transactions Processed",
        data: transactionCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const alertsData = {
    labels: severityLevels,
    datasets: [
      {
        label: "Alerts",
        data: alertsSummary,
        backgroundColor: [
          "rgba(231, 76, 60, 0.7)",
          "rgba(243, 156, 18, 0.7)",
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Staff Dashboard</h2>
      <p>
        Welcome {user?.name || "Staff"}! Here is your staff-specific analytics overview.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            background: "#f1f1f1",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Monthly Transactions</h3>
          <Bar
            data={transactionsData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "300px",
            background: "#f1f1f1",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Alert Summary</h3>
          <Bar
            data={alertsData}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
