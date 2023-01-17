import NextAuth from "next-auth";
import { Users } from "../models/users";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      lat: number;
      lng: number;
    };
  }

  interface DefaultUser {
    id: number;
    email: string;
    password: string;
    reset_pwd_token: string;
  }
}
