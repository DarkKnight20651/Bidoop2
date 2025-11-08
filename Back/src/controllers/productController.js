import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// 📦 Obtener todos los productos
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("shop");
  res.json(products);
});

// 🔍 Obtener producto por ID
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("shop");
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// ➕ Crear nuevo producto
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, shop } = req.body;
  const product = await Product.create({ name, description, price, shop });
  res.status(201).json(product);
});

// ✏️ Actualizar producto
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// 🗑️ Eliminar producto
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Producto eliminado" });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});
