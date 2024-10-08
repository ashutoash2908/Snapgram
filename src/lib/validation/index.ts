import { z } from "zod"

export const SignUpValidation = z.object({
    name: z.string().min(2,{message: "Too short"}),
    username: z.string().min(2).max(50),
    password: z.string().min(2,{message: "Password must be atleast 8 characters"}),
    email: z.string().email()
  })

  export const SigninValidation = z.object({
    password: z.string().min(2,{message: "Password must be atleast 8 characters"}),
    email: z.string().email()
  })

  export const PostValidation = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string()
  })
  