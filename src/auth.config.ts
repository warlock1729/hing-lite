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

          return {
            id: user.id,
            email:user.email,
            image:user.image,
            name:user.name
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user,token }) {
      if(session?.user){
        session.user.id = token.userId as number
        session.user.image = token.picture
      }
      return session; 
    },
  
    async jwt({token,user}) {
      if(user){
        token.userId= Number(user.id)
        token.picture=user.image
      }
      return token
    },
  },
 
} satisfies NextAuthConfig;
