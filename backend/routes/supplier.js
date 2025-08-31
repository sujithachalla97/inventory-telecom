import express from "express";
import Supplier from "../models/Supplier.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Add supplier (Admin only ideally, but keep simple)
router.post("/", auth, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all suppliers
router.get("/", auth, async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

// Update supplier
router.put("/:id", auth, async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(supplier);
});

// Delete supplier
router.delete("/:id", auth, async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json({ message: "Supplier deleted" });
});

export default router;
