"use server";

import { signIn } from "@/auth";
import { Prisma, PrismaClient, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function signInUserAction(
  data: LoginSchema
): Promise<ActionResult<object>> {
  try {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    return { status: "success", data: result };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid Credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    }
    return { status: "error", error: "Something else went wrong" };
  }
}

export async function registerUserAction(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);
    if (!validated.success)
      return { status: "error", error: validated.error.issues };

    const { email, fullName, password } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) return { status: "error", error: "User already exists" };
    return {
      status: "success",
      data: await prisma.user.create({
        data: {
          name: fullName,
          email,
          passwordHash: hashedPassword,
        },
      }),
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong!" };
  }
}

export async function getUserByEmailAction(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
