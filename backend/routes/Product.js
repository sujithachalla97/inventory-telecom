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

// Update supplier
router.put("/:id", auth, async (req, res) => {
  const product= await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});
// Delete supplier
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// Low stock alerts
router.get("/alerts", auth, async (req, res) => {
  const lowStock = await Product.find({ $expr: { $lt: ["$stock", "$reorderPoint"] } });
  res.json(lowStock);
});

export default router;
