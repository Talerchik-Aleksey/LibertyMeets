import NextAuth, { DefaultUser } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { getUserByCredentials } from "../../../services/users";

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
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user!.id = token.id as number;
        session.user!.email = token.email || "missing No";
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
