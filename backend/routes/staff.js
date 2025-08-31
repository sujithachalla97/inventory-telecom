import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

// Mock data for now
const getStaffTransactions = async (userId) => {
  return [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 19 },
    { month: "Mar", count: 7 },
  ];
};

const getStaffAlerts = async (userId) => {
  return [
    { type: "Critical", count: 3 },
    { type: "High", count: 5 },
    { type: "Low", count: 2 },
  ];
};

// ✅ Transactions summary (staff only, just requires auth)
router.get("/transactions-summary", auth, async (req, res) => {
  try {
    const transactions = await getStaffTransactions(req.user.id);
    res.json({
      labels: transactions.map((t) => t.month),
      values: transactions.map((t) => t.count),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff transactions" });
  }
});

// ✅ Alerts summary (staff only, just requires auth)
router.get("/alerts-summary", auth, async (req, res) => {
  try {
    const alerts = await getStaffAlerts(req.user.id);
    res.json({
      labels: alerts.map((a) => a.type),
      values: alerts.map((a) => a.count),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff alerts" });
  }
});

export default router;
