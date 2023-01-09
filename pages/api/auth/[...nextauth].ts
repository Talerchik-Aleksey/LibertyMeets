import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email === "123" && credentials.password === "123") {
          return { id: "1", name: "qwerty", qqq: "456" };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user!.id = token.id as string;
        session.user!.name = token.name || "missing No";
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
