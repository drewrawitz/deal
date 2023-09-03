import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const SignupSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(8).max(100),
});

export class SignupDto extends createZodDto(SignupSchema) {}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class LoginDto extends createZodDto(LoginSchema) {}
