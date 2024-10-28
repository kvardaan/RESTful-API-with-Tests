import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { describe, it, expect, beforeAll } from "vitest"

import app from "../app"
import { hash } from "bcryptjs"
import resetDB from "./helpers/resetDB"
import { getRandomInt } from "./helpers/randomNo"

describe.sequential("User Tests", () => {
  beforeAll(async () => {
    console.log("Clearing DB for User Tests")
    await resetDB()
  })

  // GET /api/v1/users/:id - gets a user with ID
  describe.sequential("GET /api/v1/users/:id - return user", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    let token = ""
    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .get("/api/v1/user/1")
        .set("Authorization", token)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .get("/api/v1/user/1")
        .set("Authorization", `Bearer ${token}12213213131313123123`)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Success - return token", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "alice@example.com",
        password: "alice",
      })
      token = response.body.token
      expect(response.status).toBe(StatusCodes.OK)
    })

    // doesUserExistWithId
    it("Error - user does not exist", async () => {
      const response = await request(app)
        .get(`/api/v1/user/${getRandomInt()}`)
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // getUserWithId
    it("Success - return user", async () => {
      const response = await request(app)
        .get("/api/v1/user/1")
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body.id).toEqual(1)
      expect(response.body.name).toEqual("Alice")
    })
  })

  // POST /api/v1/users - adds a user
  describe.sequential("POST /api/v1/users - register", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    // userAlreadyExists
    it("Error - when user already exists", async () => {
      const response = await request(app).post("/api/v1/user").send({
        email: "alice@example.com",
        password: "alice",
        name: "alice",
      })
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // validatedUser
    it("Error - wrong user credentials (email)", async () => {
      const response = await request(app).post("/api/v1/user").send({
        email: "johndoe",
        password: "johndoe123",
        name: "John Doe",
      })
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong user credentials (password)", async () => {
      const response = await request(app).post("/api/v1/user").send({
        email: "johndoe@test.com",
        password: "john",
        name: "John Doe",
      })
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong user credentials (name)", async () => {
      const response = await request(app).post("/api/v1/user").send({
        email: "johndoe@test.com",
        password: "johndoe123",
        name: "John",
      })
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // addUser
    it("Success - user registered", async () => {
      const response = await request(app).post("/api/v1/user").send({
        email: "randomuser@test.com",
        password: "randomuser123",
        name: "Random User",
      })
      expect(response.status).toBe(StatusCodes.CREATED)
    })
  })

  // PATCH /api/v1/users/:id - edits a user info
  describe.sequential("PATCH /api/v1/users/:id - edit user", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .patch("/api/v1/user/1")
        .send({
          email: "alice@example.com",
          name: "Alice XYZ",
          password: "alicexyz123",
        })
        .set("Authorization", "")
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .patch("/api/v1/user/1")
        .send({
          email: "alice@example.com",
          name: "Alice XYZ",
          password: "alicexyz123",
        })
        .set("Authorization", `Bearer 12213213131313123123`)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    let token = ""
    it("Success - return token", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "alice@example.com",
        password: "alice",
      })
      token = response.body.token
      expect(response.status).toBe(StatusCodes.OK)
    })

    // doesUserExistWithId
    it("Error - user does not exist", async () => {
      const response = await request(app)
        .patch(`/api/v1/user/${getRandomInt()}`)
        .send({
          email: "alice@example.com",
          name: "Alice XYZ",
          password: "alicexyz123",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // validatedUser
    it("Error - wrong user data (email)", async () => {
      const response = await request(app)
        .patch("/api/v1/user/1")
        .send({
          email: "johndoe",
          name: "John Doe",
          password: "johndoe123",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong user data (name)", async () => {
      const response = await request(app)
        .patch("/api/v1/user/1")
        .send({
          email: "johndoe@test.com",
          name: "John",
          password: "johndoe123",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong user data (password)", async () => {
      const response = await request(app)
        .patch("/api/v1/user/1")
        .send({
          email: "johndoe@test.com",
          name: "John Doe",
          password: "john",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // getUserWithId
    it("Success - edit user", async () => {
      const response = await request(app)
        .patch("/api/v1/user/1")
        .send({
          email: "alice@example.com",
          name: "Alice XYZ",
          password: await hash("alicexyz123", 12),
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.CREATED)
      expect(response.body.updatedUser.email).toEqual("alice@example.com")
      expect(response.body.updatedUser.name).toEqual("Alice XYZ")
    })
  })

  // DELETE /api/v1/users/:id - removes a user
  describe.sequential("Delete /api/v1/users/:id - delete user", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .delete("/api/v1/user/1")
        .set("Authorization", "")
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .delete("/api/v1/user/1")
        .set("Authorization", `Bearer 12213213131313123123`)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    let token = ""
    it("Success - return token", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "alice@example.com",
        password: "alice",
      })
      token = response.body.token
      expect(response.status).toBe(StatusCodes.OK)
    })

    // doesUserExistWithId
    it("Error - user does not exist", async () => {
      const response = await request(app)
        .delete(`/api/v1/user/${getRandomInt()}`)
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // removeUserWithId
    it("Success - delete user", async () => {
      const response = await request(app)
        .delete("/api/v1/user/1")
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.OK)
    })
  })
})
