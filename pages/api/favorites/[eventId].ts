import type { NextApiRequest, NextApiResponse } from "next";
import { changeFavoritePost, savePostToDb } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { getSession } from "next-auth/react";

type ResType = {
  status: string;
  data: any;
};

type QueryType = { eventId: string };

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const query = req.query as QueryType;
    const postId = +query.eventId;

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const isFavorite = await changeFavoritePost(session.user.id, postId);
    res.status(200).json({ status: "ok", data: { postId, isFavorite } });
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
