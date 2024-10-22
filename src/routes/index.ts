import { Router } from "express"

import { authRoutes } from "./auth.route"
import { userRoutes } from "./user.route"
import { postRoutes } from "./post.route"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/posts", authMiddleware, postRoutes)

export { router as rootRouter }
