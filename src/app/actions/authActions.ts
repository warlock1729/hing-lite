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


async function getUserByEmail(email:string){
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user
  } catch (error) {
    
  }
}

export async function signInUserAction(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const [wid,user] = await Promise.all([getDefaultWorkspaceId(data.email),getUserByEmail(data.email)]);
    if(!user) return {status:'error',error:"Email does not exist"}

    if(!user.emailVerified){
      const verificationToken = await generateToken(user.email)
      console.log(await sendVerificationMail(user.email,verificationToken.token))
      return {status:"error",error:"Please verify your email address"}
    }
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


    const existingUser = await getUserByEmail(email)

    if (existingUser) return { status: "error", error: "User already exists" };
    const hashedPassword = await bcrypt.hash(password, 10);

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



type VerifyEmailResult = {
  message: string;
};

export async function verifyEmailAction(
  token: string | null
): Promise<ActionResult<VerifyEmailResult>> {
  if (!token) {
    return {
      status: 'error',
      error: 'Verification token is missing.',
    };
  }

  const verificationToken = await prisma.token.findFirst({
    where: { token },
  });

  if (!verificationToken) {
    return {
      status: 'error',
      error: 'Invalid verification token.',
    };
  }

  if (verificationToken.expires <= new Date()) {
    await prisma.token.delete({
      where: { id: verificationToken.id },
    });

    return {
      status: 'error',
      error: 'Verification token has expired. Please request a new one.',
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
  });

  if (!user) {
    await prisma.token.delete({
      where: { id: verificationToken.id },
    });

    return {
      status: 'error',
      error: 'User not found.',
    };
  }

  // 6️⃣ Already verified
  if (user.emailVerified) {
    await prisma.token.delete({
      where: { id: verificationToken.id },
    });

    return {
      status: 'error',
      error: 'Your email is already verified.',
    };
  }

  // 7️⃣ SUCCESS (atomic)
  await prisma.$transaction([
    prisma.user.update({
      where: { email: user.email },
      data: { emailVerified: new Date() },
    }),
    prisma.token.delete({
      where: { id: verificationToken.id },
    }),
  ]);

  return {
    status: 'success',
    data: {
      message: 'Your email has been verified successfully.',
    },
  };
}


