import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import { NextFunction, Request, Response } from "express"

import prisma from "../utils/config/prismaClient"

// GET /api/v1/posts - get all the posts of a user
export const getPosts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.cookies

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: id },
    })

    response.status(StatusCodes.OK).json(posts)
  } catch (error) {
    return next(
      createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: ${error}`)
    )
  }
}

// GET /api/v1/posts/:id - gets a post with ID
export const getPostWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params

  try {
    const post = await prisma.post.findFirst({
      where: { id: Number(id) },
    })
    response.status(StatusCodes.OK).json(post)
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error fetching post: ${error}`
      )
    )
  }
}

// POST /api/v1/posts - adds a post
export const addPost = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.cookies
  const postData = request.body

  try {
    const newPost = await prisma.post.create({
      data: { ...postData, authorId: id },
    })

    response.status(StatusCodes.CREATED).json({
      message: `'${newPost.title}' created successfully`,
      post: newPost,
    })
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    )
  }
}

// PATCH /api/v1/posts/:id - edits a post
export const editPostWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params
  const { title, content, published } = request.body

  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    })

    response.status(StatusCodes.CREATED).json({
      message: `'${updatedPost.title}' edited successfully`,
      post: updatedPost,
    })
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    )
  }
}

// DELETE /api/v1/posts/:id - removes a post
export const removePostWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params

  try {
    const deletedPost = await prisma.post.delete({
      where: { id: Number(id) },
    })

    response.status(StatusCodes.OK).json({
      message: `Deleted '${deletedPost.title}' successfully`,
      post: deletedPost,
    })
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error deleting post: ${error}`
      )
    )
  }
}
