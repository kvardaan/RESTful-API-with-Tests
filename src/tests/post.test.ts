import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { describe, it, expect, beforeAll } from "vitest"

import app from "../app"
import resetDB from "./helpers/resetDB"
import { getRandomInt } from "./helpers/randomNo"

describe.sequential("Post Tests", () => {
  beforeAll(async () => {
    console.log("Clearing DB for Post Tests")
    await resetDB()
  })

  // GET /api/v1/posts - get all the posts of a user
  describe.sequential("GET /api/v1/posts - return posts", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    let token = ""
    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .get("/api/v1/posts")
        .set("Authorization", token)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .get("/api/v1/posts")
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

    // getPosts
    it("Success - return posts", async () => {
      const response = await request(app)
        .get("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.OK)
    })
  })

  // GET /api/v1/posts/:id - gets a post with ID
  describe.sequential("GET /api/v1/posts/:id - return a post with ID", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    let token = ""
    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .get("/api/v1/posts/1")
        .set("Authorization", token)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .get("/api/v1/posts/1")
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

    // doesPostExistWithId
    it("Error - post does not exist", async () => {
      const response = await request(app)
        .get(`/api/v1/posts/${getRandomInt()}`)
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // getPostWithId
    it("Success - return post", async () => {
      const response = await request(app)
        .get("/api/v1/posts/1")
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body.id).toBe(1)
      expect(response.body.title).toBe("First Post")
      expect(response.body.published).toBe(true)
    })
  })

  // POST /api/v1/posts - adds a post
  describe.sequential("POST /api/v1/posts - add post", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    let token = ""
    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", token)
        .send({
          title: "new-post-title",
          content: "new-post-content",
          published: true,
        })
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}12213213131313123123`)
        .send({
          title: "new-post-title",
          content: "new-post-content",
          published: true,
        })
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

    // validatedPost
    it("Error - wrong post data (title)", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .send({
          title: "post",
          published: false,
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong post data (published - type)", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .send({
          title: "new-post-title",
          published: "xyz",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong post data (published - empty)", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .send({
          title: "new-post-title",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // addPost
    it("Success - add post", async () => {
      const response = await request(app)
        .post("/api/v1/posts")
        .send({
          title: "new-post-title",
          content: "new-post-content",
          published: false,
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.CREATED)
    })
  })

  // PATCH /api/v1/posts/:id - edits a post
  describe.sequential("PATCH /api/v1/posts/:id - edit post", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    let token = ""
    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .patch("/api/v1/posts/1")
        .set("Authorization", token)
        .send({
          title: "post-title",
          content: "post-content",
          published: true,
        })
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .patch("/api/v1/posts/1")
        .set("Authorization", `Bearer ${token}12213213131313123123`)
        .send({
          title: "post-title",
          content: "post-content",
          published: true,
        })
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

    // doesPostExistWithId
    it("Error - post does not exist", async () => {
      const response = await request(app)
        .patch(`/api/v1/posts/${getRandomInt()}`)
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // validatedPost
    it("Error - wrong post data (title)", async () => {
      const response = await request(app)
        .patch("/api/v1/posts/1")
        .send({
          title: "post",
          published: false,
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong post data (published - type)", async () => {
      const response = await request(app)
        .patch("/api/v1/posts/1")
        .send({
          title: "post-title",
          published: "xyz",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Error - wrong post data (published - empty)", async () => {
      const response = await request(app)
        .patch("/api/v1/posts/1")
        .send({
          title: "post-title",
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // editPostWithId
    it("Success - Edit Post", async () => {
      const response = await request(app)
        .patch("/api/v1/posts/1")
        .send({
          title: "post-title",
          content: "post-content",
          published: true,
        })
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.CREATED)
    })
  })

  // DELETE /api/v1/posts/:id - removes a post
  describe.sequential("Delete /api/v1/posts/:id - delete post", () => {
    beforeAll(async () => {
      console.log("Clearing DB")
      await resetDB()
    })

    let token = ""
    // authMiddleware
    it("Error - token is missing", async () => {
      const response = await request(app)
        .delete("/api/v1/posts/1")
        .set("Authorization", token)
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Error - token is wrong", async () => {
      const response = await request(app)
        .delete("/api/v1/posts/1")
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

    // doesPostExistWithId
    it("Error - post does not exist", async () => {
      const response = await request(app)
        .delete(`/api/v1/posts/${getRandomInt()}`)
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    // removePostWithId
    it("Success - Delete Post", async () => {
      const response = await request(app)
        .delete("/api/v1/posts/1")
        .set("Authorization", `Bearer ${token}`)
      expect(response.status).toBe(StatusCodes.OK)
      expect(response.body.post.id).toBe(1)
      expect(response.body.post.title).toBe("First Post")
      expect(response.body.post.published).toBe(true)
    })
  })
})
