import bcrypt from "bcryptjs"
import createHttpError from "http-errors"
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

import { userType } from "../types/user.type"
import prisma from "../utils/config/prismaClient"

// GET /api/v1/users - get all the users
export const getUsers = async (response: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
    })

    response.status(StatusCodes.OK).json(users)
  } catch (error) {
    return next(
      createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: ${error}`)
    )
  }
}

// GET /api/v1/users/:id - gets a user with ID
export const getUserWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { posts: true },
    })
    response.status(StatusCodes.OK).json(user)
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error fetching user: ${error}`
      )
    )
  }
}

// POST /api/v1/users - adds a user
export const addUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData: userType = request.body

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    })

    response
      .status(StatusCodes.CREATED)
      .json({ message: `'${newUser.name}' created successfully` })
  } catch (error: any) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    )
  }
}

// PATCH /api/v1/users/:id - edits a user info
export const editUserWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, name } = request.body

  try {
    const newUser = await prisma.user.update({
      where: { email },
      data: { name },
    })

    response
      .status(StatusCodes.CREATED)
      .json({ message: `'${newUser.name}' edited successfully` })
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error"
      )
    )
  }
}

// DELETE /api/v1/users/:id - removes a user
export const removeUserWithId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params

  try {
    const user = await prisma.user.delete({
      where: { id: Number(id) },
      include: { posts: true },
    })

    response
      .status(StatusCodes.OK)
      .json({ message: `Deleted '${user.name}' successfully` })
  } catch (error) {
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error deleting user: ${error}`
      )
    )
  }
}
