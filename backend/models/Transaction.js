import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  productId: String,
  type: { type: String, enum: ["in", "out"] },
  quantity: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);
