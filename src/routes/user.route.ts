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

router.post("/", userAlreadyExists, validatedUser, addUser)

router.use(authMiddleware)

router.get("/:id", doesUserExistWithId, getUserWithId)
router.patch("/:id", doesUserExistWithId, validatedUser, editUserWithId)
router.delete("/:id", doesUserExistWithId, removeUserWithId)

export { router as userRoutes }
