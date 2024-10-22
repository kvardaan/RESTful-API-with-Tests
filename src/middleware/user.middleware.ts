import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import prisma from "../utils/config/prismaClient"
import { userSchema, userType } from "../types/user.type"

export const validatedUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData: userType = request.body

  const validatedUser = userSchema.safeParse(userData)

  if (!validatedUser.success) {
    return next(
      createHttpError(
        StatusCodes.BAD_REQUEST,
        validatedUser.error.issues[0].message
      )
    )
  }

  next()
}

export const userAlreadyExists = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData: userType = request.body

  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  })

  if (existingUser) {
    return next(
      createHttpError(StatusCodes.BAD_REQUEST, "Email already taken!")
    )
  }

  next()
}

export const doesUserExists = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params
  const existingUser = await prisma.user.findFirst({
    where: { id: Number(id) },
  })

  if (!existingUser) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, "User doesnot exist!"))
  }

  next()
}
