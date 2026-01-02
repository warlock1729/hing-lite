import { User as DefaultUser} from "next-auth"
import {  JWT as DefaultJWT} from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id:number
  }

    interface Session {
    user: {
      id: number
    } & DefaultSession["user"]
  }
  
}

declare module "next-auth/jwt" {
 interface JWT extends DefaultJWT {
    userId?: number;
  }}
