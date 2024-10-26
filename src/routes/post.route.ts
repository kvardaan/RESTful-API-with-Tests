import { Router } from "express"

import {
  getPosts,
  getPostWithId,
  addPost,
  editPostWithId,
  removePostWithId,
} from "../controllers/post.controller"
import {
  doesPostExistWithId,
  validatedPost,
} from "../middleware/post.middleware"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

router.use(authMiddleware)

router.get("/", getPosts)
router.get("/:id", getPostWithId)
router.post("/", validatedPost, addPost)
router.patch("/:id", doesPostExistWithId, validatedPost, editPostWithId)
router.delete("/:id", doesPostExistWithId, removePostWithId)

export { router as postRoutes }
