// src/controllers/productController.js
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("place");
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("place");
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// ➕ Crear nuevo producto
export const createProduct = asyncHandler(async (req, res) => {
  // Lo que venga en el body
  const { name, description, price, place } = req.body;

  console.log("BODY createProduct:", req.body);
  console.log("FILE createProduct:", req.file);

  // Construimos la URL de la imagen si viene archivo
  let imageUrl = null;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const product = await Product.create({
    name,
    description,
    price,
    place,
    url: imageUrl, // 👈 este campo debe existir en el schema
  });

  res.status(201).json(product);
});

// ✏️ Actualizar producto
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, place } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Producto no encontrado");
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (place) product.place = place;

  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    product.url = imageUrl;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
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
