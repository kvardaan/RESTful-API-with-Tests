import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import { NextFunction, Request, Response } from "express"

import { postSchema, postType } from "../types/post.type"
import prisma from "../utils/config/prismaClient"

export const validatedPost = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const postData: postType = request.body

  const validatedPost = postSchema.safeParse(postData)
  if (!validatedPost.success) {
    return next(
      createHttpError(
        StatusCodes.BAD_REQUEST,
        validatedPost.error.issues[0].message
      )
    )
  }

  next()
}

export const doesPostExistWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params
  const existingUser = await prisma.post.findFirst({
    where: { id: Number(id) },
  })

  if (!existingUser) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, "Post doesnot exist!"))
  }

  next()
}
