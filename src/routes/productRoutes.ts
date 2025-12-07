// src/routes/productRoutes.ts

import { Router } from "express"
import ProductController from "../controllers/productController"
import authMiddleware from "../middleware/authMiddleware"
import upload from "../middleware/uploadMiddleware"

const productRouter = Router()

// ✅ RUTA PÚBLICA (Lectura) - ¡ELIMINAR authMiddleware AQUÍ!
productRouter.get("/", ProductController.getAllProducts) 
productRouter.get("/:id", ProductController.getProduct)

// ✅ RUTAS PRIVADAS (Escritura) - Estas SÍ llevan authMiddleware
productRouter.post("/", authMiddleware, upload.single("image"), ProductController.addProduct)
productRouter.patch("/:id", authMiddleware, ProductController.updateProduct)
productRouter.delete("/:id", authMiddleware, ProductController.deleteProduct)

export default productRouter