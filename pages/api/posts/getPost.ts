import type { NextApiRequest, NextApiResponse } from "next";
import { getPost } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type QueryType = {
  postId: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = req.query as QueryType;
    const postId = +query.postId;

    const post = await getPost(postId);
    if (!post) {
      res.status(404).json({ message: "no post" });
      return;
    }
    res.status(200).json({ message: "ok", data: post });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res.status(httpErr.httpCode).json({ message: httpErr.message });
      return;
    } else {
      const error = err as Error;
      res.status(500).json({ message: error.message });
      return;
    }
  }
}
