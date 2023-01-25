import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import { handleReplyToPost } from "../../../services/reply";
import { getPost } from "../../../services/posts";

type ResType = {
  status: string;
  data: any;
};

type QueryType = {
  postId: number | undefined;
  threadUserId: number | undefined;
};

type BodyType = {
  message: string;
};

connect();

// Terminology:
// userId - any user
// author = post owner, postId
// stranger = thread starter


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    let { postId } = req.query as QueryType;
    postId = Number(postId);
    if (!postId || isNaN(postId)) {
      throw new HttpError(400, "no postId");
    }

    let { message } = req.body as BodyType;
    if (!message) {
      throw new HttpError(400, "no message");
    }
    if (message.trim().length === 0) {
      throw new HttpError(400, "empty message");
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }
    const userId = Number(session?.user.id);

    const post = await getPost(postId);
    if (!post) {
      res.status(404);
      return;
    }

    console.log('Before handling', post);
    await handleReplyToPost(userId, post, message);

    res.status(200).json({ status: "ok", data: {} });
  } catch (err) {
    console.log(err);
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
