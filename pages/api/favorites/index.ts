import type { NextApiRequest, NextApiResponse } from "next";
import { getFavoritePosts } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { getSession } from "next-auth/react";

type ResType = {
  status: string;
  data: any;
};

type QueryType = {
  page: number | undefined;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
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

    const { posts, count } = await getFavoritePosts(page, session?.user);
    res.status(200).json({ status: "ok", data: { posts, count } });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
}
