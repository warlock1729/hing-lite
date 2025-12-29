import Credentials from "next-auth/providers/credentials";
import { type NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/loginSchema";
import bcrypt, { compare } from "bcryptjs";
import { getUserByEmailAction } from "./app/actions/authActions";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds);
        if (validated.success) {
          const { email, password } = validated.data;
          const user = await getUserByEmailAction(email);

          if (!user || !(await compare(password, user.passwordHash))) {
            return null;
          }

          const { id } = user;
          return {
            ...user,
            id: id.toString(),
          };
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
