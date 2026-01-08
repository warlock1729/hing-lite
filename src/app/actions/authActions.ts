"use server";

import { signIn } from "@/auth";
import { Prisma, PrismaClient, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { getDefaultWorkspaceId } from "./workspaceActions";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { saveAvatar } from "@/lib/server_utils";
import { sendVerificationMail } from "@/lib/mail";
import { generateToken } from "@/lib/token";

export async function signInUserAction(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const wid = await getDefaultWorkspaceId(data.email);
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    return { status: "success", data: `/workspace/${wid}/home` };
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

    const DEFAULT_AVATAR = "/avatar-placeholder.png";
    let avatarUrl = DEFAULT_AVATAR;
       if (data.profileImage instanceof File) {
      avatarUrl = await saveAvatar(data.profileImage,email);
    }
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        passwordHash: hashedPassword,
        image:avatarUrl,
        workspaceMembers: {
          create: {
            role: "OWNER",
            workspace: {
              create: {
                description: `default workspace`,
                name: "Default workspace",
                people: 2,
              },
            },
          },
        },
      },
    });
    const verificationToken = await generateToken(email)
    await sendVerificationMail(email,verificationToken.token)
    return {
      status: "success",
      data: newUser,
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
