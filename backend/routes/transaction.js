import express from "express";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Add a stock transaction
router.post("/", auth, async (req, res) => {
  try {
    const { productId, type, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (type === "in") {
      product.stock += quantity;
    } else if (type === "out") {
      if (product.stock < quantity) {
        return res.status(400).json({ error: "Not enough stock" });
      }
      product.stock -= quantity;
    }

    await product.save();
    const transaction = new Transaction({ productId, type, quantity });
    await transaction.save();

    res.json({ message: "Transaction recorded", transaction, updatedStock: product.stock });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transactions
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

export default router;
