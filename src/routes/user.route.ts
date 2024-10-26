import { Router } from "express"

import {
  doesUserExistWithId,
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

router.get("/:id", authMiddleware, doesUserExistWithId, getUserWithId)
router.post("/", userAlreadyExists, validatedUser, addUser)
router.patch(
  "/:id",
  authMiddleware,
  doesUserExistWithId,
  validatedUser,
  editUserWithId
)
router.delete("/:id", authMiddleware, doesUserExistWithId, removeUserWithId)

export { router as userRoutes }
