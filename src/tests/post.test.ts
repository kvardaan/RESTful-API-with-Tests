import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { describe, it, expect, vi } from "vitest"

import app from "../app"

describe("GET / - return posts", () => {
  // authMiddleware
  it("Error - token is missing", async () => {
    const response = await request(app).get("/api/v1/posts")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token is wrong", async () => {
    const response = await request(app).get("/api/v1/posts")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token has expired", async () => {
    const response = await request(app).get("/api/v1/posts")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - jwt issue", async () => {
    const response = await request(app).get("/api/v1/posts")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  // getPosts
  it("Success - return posts", async () => {
    const response = await request(app).get("/api/v1/posts")
    expect(response.status).toBe(StatusCodes.OK)
  })
})

describe("GET /:id - return posts", () => {
  // authMiddleware
  it("Error - token is missing", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token is wrong", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token has expired", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - jwt issue", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  // getPostWithId
  it("Success - return post", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.OK)
  })
})

describe("POST / - add post", () => {
  // authMiddleware
  it("Error - token is missing", async () => {
    const response = await request(app).get("/api/v1/posts").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token is wrong", async () => {
    const response = await request(app).get("/api/v1/posts").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token has expired", async () => {
    const response = await request(app).get("/api/v1/posts").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - jwt issue", async () => {
    const response = await request(app).get("/api/v1/posts").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  // validatedPost
  it("Error - wrong post data (title)", async () => {
    const response = await request(app).post("/api/v1/posts").send({
      title: "post",
      published: false,
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it("Error - wrong post data (published - type)", async () => {
    const response = await request(app).post("/api/v1/posts").send({
      title: "post-title",
      published: "xyz",
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it("Error - wrong post data (published - empty)", async () => {
    const response = await request(app).post("/api/v1/posts").send({
      title: "post-title",
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  // addPost
  it("Success - add post", async () => {
    const response = await request(app).post("/api/v1/posts").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.CREATED)
  })
})

describe("PATCH /:id - edit post", () => {
  // authMiddleware
  it("Error - token is missing", async () => {
    const response = await request(app).get("/api/v1/posts/1").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token is wrong", async () => {
    const response = await request(app).get("/api/v1/posts/1").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token has expired", async () => {
    const response = await request(app).get("/api/v1/posts/1").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - jwt issue", async () => {
    const response = await request(app).get("/api/v1/posts/1").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  // doesPostExistWithId
  it("Error - post does not exist", async () => {
    const response = await request(app).get("/api/v1/posts/1").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  // validatedPost
  it("Error - wrong post data (title)", async () => {
    const response = await request(app).post("/api/v1/posts/1").send({
      title: "post",
      published: false,
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it("Error - wrong post data (published - type)", async () => {
    const response = await request(app).post("/api/v1/posts/1").send({
      title: "post-title",
      published: "xyz",
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it("Error - wrong post data (published - empty)", async () => {
    const response = await request(app).post("/api/v1/posts/1").send({
      title: "post-title",
    })
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  // editPostWithId
  it("Success - Edit Post", async () => {
    const response = await request(app).patch("/api/v1/posts/1").send({
      title: "post-title",
      content: "post-content",
      published: true,
    })
    expect(response.status).toBe(StatusCodes.CREATED)
  })
})

describe("Delete /:id - delete post", () => {
  // authMiddleware
  it("Error - token is missing", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token is wrong", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - token has expired", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("Error - jwt issue", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  // doesPostExistWithId
  it("Error - post does not exist", async () => {
    const response = await request(app).get("/api/v1/posts/1")
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  // removePostWithId
  it("Success - Delete Post", async () => {
    const response = await request(app).patch("/api/v1/posts")
    expect(response.status).toBe(StatusCodes.OK)
  })
})
