import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";

// You’ll need to implement these service functions
// For now, placeholder functions to avoid crashes
const getStaffTransactions = async (userId) => {
  // Example: query transactions created by staff user
  return [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 19 },
    { month: "Mar", count: 7 },
  ];
};

const getStaffAlerts = async (userId) => {
  // Example: query alerts assigned to staff user
  return [
    { type: "Critical", count: 3 },
    { type: "High", count: 5 },
    { type: "Low", count: 2 },
  ];
};

const router = express.Router();

// ✅ Transactions summary (staff only)
router.get(
  "/transactions-summary",
  authMiddleware,
  roleMiddleware("staff"),
  async (req, res) => {
    try {
      const transactions = await getStaffTransactions(req.user.id);
      res.json({
        labels: transactions.map((t) => t.month),
        values: transactions.map((t) => t.count),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch staff transactions" });
    }
  }
);

// ✅ Alerts summary (staff only)
router.get(
  "/alerts-summary",
  authMiddleware,
  roleMiddleware("staff"),
  async (req, res) => {
    try {
      const alerts = await getStaffAlerts(req.user.id);
      res.json({
        labels: alerts.map((a) => a.type),
        values: alerts.map((a) => a.count),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch staff alerts" });
    }
  }
);

export default router;
