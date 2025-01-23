import z from "zod"

//Username Validation
export const usernameValidation = z
.string()
.min(2, "Username must be aleast 2 character")
.max(20, "Username must be no more then 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
    username: z
    .string()
    .min(2,"Username must be atleast 2 charaters")
    .max(20, "Username must not contain special character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character"),

    password: z
    .string()
    .min(6, {message: "Password must be atleast 6 character"}),

    firstname: z
    .string()
    .min(2, "First name must have atleast 2 character")
    .max(20, "Firstname must be no more then 20 character"),

    lastname: z
    .string()
    .min(2, "First name must have atleast 2 character")
    .max(20, "Firstname must be no more then 20 character"),

    city: z
    .string()
    .min(2, "First name must have atleast 2 character")
    .max(20, "Firstname must be no more then 20 character"),

    country: z
    .string()
    .min(2, "First name must have atleast 2 character")
    .max(20, "Firstname must be no more then 20 character"),


})