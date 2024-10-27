import { hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: await hash("alice", 10),
      name: "Alice",
      posts: {
        create: [
          {
            title: "First Post",
            content: "This is the content of the first post.",
            published: true,
          },
          {
            title: "Second Post",
            content: "This is the content of the second post.",
            published: false,
          },
        ],
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      password: await hash("bob", 10),
      name: "Bob",
      posts: {
        create: [
          {
            title: "Hello World",
            content: "This is my first post on this platform.",
            published: true,
          },
        ],
      },
    },
  })

  console.log(`Created ${user1?.email} and ${user2?.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma?.$disconnect()
  })
