import type { NextApiRequest, NextApiResponse } from "next";
import config from "config";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import { isAuthorCheck } from "../../../services/posts";
import { getThreads } from "../../../services/threads";

type ResType = {
  status: string;
  data: any;
};

type QueryType = {
  postId: number | undefined;
};

connect();
const APP_URL = config.get<string>("appUrl");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    let { postId } = req.query as QueryType;
    if (!postId) {
      throw new HttpError(400, "no postId");
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }
    const userId = session?.user.id;
    const isAuthor = isAuthorCheck(userId, postId);
    if (!isAuthor) {
      res.status(403);
      return;
    }

    const threads = await getThreads(postId);
    res.status(200).json({ status: "ok", data: { threads } });
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
