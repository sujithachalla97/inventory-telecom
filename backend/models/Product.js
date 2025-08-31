import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  stock: Number,
  reorderPoint: Number
});

export default mongoose.model("Product", productSchema);
