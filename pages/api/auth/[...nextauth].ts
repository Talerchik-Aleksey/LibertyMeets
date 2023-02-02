import NextAuth, { DefaultUser } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { getUserByCredentials } from "../../../services/users";
import { DEFAULT_LAT, DEFAULT_LNG } from "../../../constants/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import config from "config";

const secret = process.env.NEXTAUTH_SECRET! as string;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies({ req });
  let maxAge = config.get<number>("token.short");
  console.log(req.body);

  if (cookies["remember-me"] && cookies["remember-me"] === "true") {
    maxAge = config.get<number>("token.long");
  } else if (req.body.rememberMe) {
    maxAge =
      req.body.rememberMe === "true"
        ? config.get<number>("token.long")
        : config.get<number>("token.short");
    console.log(maxAge);
    setCookie({ res }, "remember-me", req.body.rememberMe, {
      maxAge,
      path: "/",
    });
  }

  const options = {
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
            token.lat = DEFAULT_LAT;
            token.lng = DEFAULT_LNG;
          } else {
            token.lat = null;
            token.lng = null;
          }
          token.id = user.id;
          token.email = user.email;
          token.liveTime = new Date();
        }
        return token;
      },
      session: ({ session, token }) => {
        if (token) {
          session.user!.id = token.id as number;
          session.user!.email = token.email as string;
          session.user!.lat = token.lat as number;
          session.user!.lng = token.lng as number;
        }
        session.expires = "2023-03-04T16:03:400Z";
        return session;
      },
    },
    events: {
      async signOut() {
        destroyCookie({ res }, "remember-me", {
          path: "/",
        });
      },
    },
    secret,
    session: {
      maxAge,
    },
    jwt: {
      maxAge,
    },
    pages: {
      signIn: "/signin",
    },
  };

  return NextAuth(req, res, options);
}
