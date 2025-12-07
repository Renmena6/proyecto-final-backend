// src/routes/authRouter.ts

import { Router } from "express"
import AuthController from "../controllers/authController"
import limiter from "../middleware/rateLimitMiddleware" // <-- 1. IMPORTAR EL LIMITER

const authRouter = Router()

//  APLICAR EL LIMITER COMO MIDDLEWARE
authRouter.post("/register", limiter, AuthController.register) 
// APLICAR EL LIMITER COMO MIDDLEWARE
authRouter.post("/login", limiter, AuthController.login) 

export default authRouter