import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Add product
router.post("/", auth, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Get all products
router.get("/", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Low stock alerts (place before :id routes)
router.get("/alerts", auth, async (req, res) => {
  const lowStock = await Product.find({ $expr: { $lt: ["$stock", "$reorderPoint"] } });
  res.json(lowStock);
});

// Update product
router.put("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
