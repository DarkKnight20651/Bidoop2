// src/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Configuración de multer para guardar en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // carpeta 'uploads' en la raíz del proyecto Back
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct); // 👈 "image" es el nombre del campo
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
