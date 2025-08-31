import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ------------------ PROFILE (me) ------------------ */

// GET logged-in user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // don’t expose password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// UPDATE logged-in user
router.put("/me", auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updates = { name, email };
    if (password && password.trim() !== "") {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

/* ------------------ MANAGERS ------------------ */

// GET all managers
router.get("/managers", async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }).select("-password");
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch managers" });
  }
});

// POST add manager
router.post("/managers", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newManager = await User.create({ ...req.body, password: hashedPassword, role: "manager" });
    res.status(201).json(newManager);
  } catch (err) {
    res.status(500).json({ message: "Failed to add manager" });
  }
});

// PUT update manager
router.put("/managers/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedManager = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json(updatedManager);
  } catch (err) {
    res.status(500).json({ message: "Failed to update manager" });
  }
});

// DELETE manager
router.delete("/managers/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete manager" });
  }
});

/* ------------------ STAFF ------------------ */

// GET all staff
router.get("/staff", async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
});

// POST add staff
router.post("/staff", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newStaff = await User.create({ ...req.body, password: hashedPassword, role: "staff" });
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(500).json({ message: "Failed to add staff" });
  }
});

// PUT update staff
router.put("/staff/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedStaff = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json(updatedStaff);
  } catch (err) {
    res.status(500).json({ message: "Failed to update staff" });
  }
});

// DELETE staff
router.delete("/staff/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete staff" });
  }
});

export default router;
