import z from "zod"

//Username Validation
export const usernameValidation = z
.string()
.min(2, "Username must be aleast 2 character")
.max(20, "Username must be no more then 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

