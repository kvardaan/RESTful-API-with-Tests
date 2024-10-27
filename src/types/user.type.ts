import { z } from "zod"

export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z
    .string()
    .min(5, { message: "Name must be 5 or more characters long" })
    .max(32, {
      message: "Name must be 32 or less characters long",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 or more characters long" })
    .max(128, {
      message: "Password must be 128 or less characters long",
    }),
})

export type userType = z.infer<typeof userSchema>
