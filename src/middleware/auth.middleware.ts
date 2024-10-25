import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import { verify, JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

import { config } from "../utils/config/env"
import prisma from "../utils/config/prismaClient"

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, "Not Authorized"))
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = verify(token, config.JWT_SECRET) as JwtPayload
    if (typeof decoded.id !== "string") {
      return next(createHttpError(StatusCodes.UNAUTHORIZED, "Invalid token"))
    }

    request.cookies.id = decoded.id
    next()
  } catch (error: Error | any) {
    if (error.name === "TokenExpiredError") {
      return next(createHttpError(StatusCodes.UNAUTHORIZED, "Token expired"))
    } else if (error.name === "JsonWebTokenError") {
      return next(createHttpError(StatusCodes.UNAUTHORIZED, "Invalid token"))
    } else {
      return next(
        createHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          JSON.parse(JSON.stringify(error.message))
        )
      )
    }
  }
}

export const doesUserExists = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email } = request.body
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, "User doesnot exist!"))
  }

  next()
}
