import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getUserPosts } from "../../../services/posts";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";
import { Posts } from "../../../models/posts";

type Payload = {
  posts: {
    userPosts: Posts[];
    count: number;
  };
};

type QueryType = {
  page: number | undefined;
};

export default async function userPosts(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    let { page } = req.query as QueryType;
    if (!page) {
      page = 1;
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const posts = await getUserPosts(page, session.user.id);
    res.status(200).json({ status: "ok", data: { posts } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
