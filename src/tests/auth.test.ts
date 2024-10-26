import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { describe, it, expect, vi } from "vitest"

import app from "../app"

describe("POST /login - login", () => {
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

describe("POST /logout - logout", () => {
  it("Logout successfully", async () => {
    const response = await request(app).post("/api/v1/auth/logout")
    expect(response.status).toBe(StatusCodes.OK)
  })
})