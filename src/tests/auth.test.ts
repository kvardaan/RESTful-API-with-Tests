import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { describe, it, expect, beforeAll } from "vitest"

import app from "../app"
import resetDB from "./helpers/resetDB"

describe.sequential("Authentication Tests", () => {
  beforeAll(async () => {
    console.log("Clearing DB for Authentication Tests")
    await resetDB()
  })

  // POST /api/v1/auth/login - user login
  describe.sequential("POST /login - login", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    it("Error - when user doesn't exist", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "alice@test.com",
        password: "alice",
      })
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - when user credentials are wrong", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "alice@example.com",
        password: "bob",
      })
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Login successfully", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "alice@example.com",
        password: "alice",
      })
      expect(response.status).toBe(StatusCodes.OK)
    })
  })

  // POST /api/v1/auth/logout - user logout
  describe.sequential("POST /logout - logout", () => {
    it("Logout successfully", async () => {
      const response = await request(app).post("/api/v1/auth/logout")
      expect(response.status).toBe(StatusCodes.OK)
    })
  })
})
