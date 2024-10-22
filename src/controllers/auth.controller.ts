import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import { config } from "../utils/config/env"
import { authType } from "../types/auth.type"
import prisma from "../utils/config/prismaClient"

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData: authType = request.body
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
  })

  try {
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        userData.password,
        user.password
      )

      if (!isPasswordValid) {
        return next(
          createHttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials")
        )
      }

      const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
        expiresIn: "1h",
      })

      response.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })

      response
        .status(StatusCodes.OK)
        .json({ message: "Login successful", token })
    }
  } catch (error) {
    return next(
      createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: ${error}`)
    )
  }
}

export const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.clearCookie("token")
  response.status(StatusCodes.OK).json({ message: "Logout successful" })
}
