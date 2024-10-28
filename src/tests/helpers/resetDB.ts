import { hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const resetDB = async () => {
  await prisma.$transaction([
    prisma.$executeRaw`SET session_replication_role = 'replica'`,
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),

    prisma.$executeRaw`SET session_replication_role = 'replica'`,
    prisma.user.create({
      data: {
        id: 1,
        email: "alice@example.com",
        password: await hash("alice", 10),
        name: "Alice",
      },
    }),

    prisma.post.create({
      data: {
        id: 1,
        title: "First Post",
        content: "This is the content of the first post.",
        published: true,
        authorId: 1,
      },
    }),

    prisma.post.create({
      data: {
        id: 2,
        title: "Second Post",
        content: "This is the content of the second post.",
        published: false,
        authorId: 1,
      },
    }),

    prisma.user.create({
      data: {
        id: 2,
        email: "bob@example.com",
        password: await hash("bob", 10),
        name: "Bob",
      },
    }),

    prisma.post.create({
      data: {
        id: 3,
        title: "Hello World",
        content: "This is my first post on this platform.",
        published: true,
        authorId: 2,
      },
    }),
    prisma.$executeRaw`SET session_replication_role = 'replica'`,
  ])
}

export default resetDB
