import { Router } from "express"

import {
  doesUserExists,
  userAlreadyExists,
  validatedUser,
} from "../middleware/user.middleware"
import {
  addUser,
  editUserWithId,
  getUserWithId,
  removeUserWithId,
} from "../controllers/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

router.get("/:id", authMiddleware, doesUserExists, getUserWithId)
router.post("/", userAlreadyExists, validatedUser, addUser)
router.patch(
  "/:id",
  authMiddleware,
  doesUserExists,
  validatedUser,
  editUserWithId
)
router.delete("/:id", authMiddleware, doesUserExists, removeUserWithId)

export { router as userRoutes }
