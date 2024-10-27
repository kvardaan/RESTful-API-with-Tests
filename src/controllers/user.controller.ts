import bcrypt from "bcryptjs"
import createHttpError from "http-errors"
import { StatusCodes } from "http-status-codes"
import { NextFunction, Request, Response } from "express"

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
  const { id } = request.params
  const { email, name, password } = request.body

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, name, password: await bcrypt.hash(password, 12) },
    })

    response
      .status(StatusCodes.CREATED)
      .json({ message: `User edited successfully`, updatedUser })
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
    const deletePosts = prisma.post.deleteMany({
      where: {
        authorId: Number(id),
      },
    })

    const deleteUser = prisma.user.delete({
      where: {
        id: Number(id),
      },
    })

    await prisma.$transaction([deletePosts, deleteUser])

    response
      .status(StatusCodes.OK)
      .json({ message: `User deleted successfully` })
  } catch (error) {
    console.log(error)
    return next(
      createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error deleting user: ${error}`
      )
    )
  }
}
