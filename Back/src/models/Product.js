// src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  url: String, // 👈 este es el que usamos
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

export default mongoose.model("Product", productSchema);
