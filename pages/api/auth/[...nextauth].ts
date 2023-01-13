import NextAuth, { DefaultUser } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { getUserByCredentials } from "../../../services/users";

const LAT = 40.73061;
const LNG = -73.935242;

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await getUserByCredentials(credentials);
        return user as unknown as DefaultUser | null;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const isEven = +user.id % 2;
        if (isEven) {
          token.lat = LAT;
          token.lng = LNG;
        } else {
          token.lat = null;
          token.lng = null;
        }
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user!.id = token.id as number;
        session.user!.email = token.email || "missing No";
        session.user!.lat = token.lat as number;
        session.user!.lng = token.lng as number;
      }

      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
  },
  pages: {
    signIn: "/signin",
  },
});
