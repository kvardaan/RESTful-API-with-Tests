import { Router } from "express"

import {
  getPosts,
  getPostWithId,
  addPost,
  editPostWithId,
  removePostWithId,
} from "../controllers/post.controller"
import { validatedPost } from "../middleware/post.middleware"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

router.use(authMiddleware)

router.get("/", getPosts)
router.get("/:id", getPostWithId)
router.post("/", validatedPost, addPost)
router.patch("/:id", validatedPost, editPostWithId)
router.delete("/:id", removePostWithId)

export { router as postRoutes }
