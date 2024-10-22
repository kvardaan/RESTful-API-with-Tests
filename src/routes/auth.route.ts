import { Router } from "express"

import { login, logout } from "../controllers/auth.controller"
import { doesUserExists } from "../middleware/user.middleware"

const router = Router()

router.post("/login", doesUserExists, login)
router.post("/logout", doesUserExists, logout)

export { router as authRoutes }
