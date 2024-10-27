import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { describe, it, expect, vi } from "vitest"

import app from "../app"

describe("GET /:id - return user", () => {
  let token = ""
  // authMiddleware
  it("Error - token is missing", async () => {
    const response = await await request(app)
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

  // it("Error - token has expired", async () => {
  //   const response = await request(app).get("/api/v1/user/1")
  //   expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  // })

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
      .get("/api/v1/user/4")
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

describe("POST / - register", () => {
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

describe("PATCH /:id - edit user", () => {
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

  // it("Error - token has expired", async () => {
  //   const response = await request(app).patch("/api/v1/user/1")
  //   expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  // })

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
      .patch("/api/v1/user/4")
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
        password: "alicexyz123",
      })
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(StatusCodes.CREATED)
    expect(response.body.updatedUser.email).toEqual("alice@example.com")
    expect(response.body.updatedUser.name).toEqual("Alice XYZ")
  })
})

describe("Delete /:id - delete user", () => {
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

  // it("Error - token has expired", async () => {
  //   const response = await request(app).delete("/api/v1/user/1")
  //   expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  // })

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
      .delete("/api/v1/user/4")
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
