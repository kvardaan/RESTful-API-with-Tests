import { beforeEach } from "vitest"
import { PrismaClient } from "@prisma/client"
import { mockDeep, mockReset } from "vitest-mock-extended"

beforeEach(() => {
  mockReset(prismaClient)
})

export const prismaClient = mockDeep<PrismaClient>()
