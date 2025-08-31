import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: String,
  contact: String,
  orderHistory: [{ productId: String, status: String, date: Date }]
});

export default mongoose.model("Supplier", supplierSchema);
