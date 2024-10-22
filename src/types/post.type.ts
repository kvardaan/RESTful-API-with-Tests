import z from "zod"

export const postSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be 5 or more characters long",
  }),
  content: z.string().optional(),
  published: z.boolean({
    invalid_type_error: "Published must be a boolean",
    required_error: "Published is required",
  }),
})

export type postType = z.infer<typeof postSchema>
