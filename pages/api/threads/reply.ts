import type { NextApiRequest, NextApiResponse } from "next";
import config from "config";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import { getPost, isAuthorCheck } from "../../../services/posts";
import {
  createThread,
  createThreadMessage,
  getThread,
} from "../../../services/threads";
import { sendReplyMessage } from "../../../services/email";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    let { postId, threadUserId } = req.query as QueryType;
    if (!postId) {
      throw new HttpError(400, "no postId");
    }
    if (!threadUserId) {
      throw new HttpError(400, "no userId");
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
    const userId = session?.user.id;
    const isAuthor = await isAuthorCheck(userId, postId);
    let thread = await getThread(postId, threadUserId);

    if (thread && !isAuthor && userId !== thread.user_id) {
      res.status(403);
      return;
    }

    if (!thread) {
      if (isAuthor) {
        throw new HttpError(418, "author cannot start thread in his post");
      } else {
        await createThread(postId, userId);
      }
    }

    thread = await getThread(postId, threadUserId);
    await createThreadMessage(thread!.id, userId, message);

    const post = await getPost(thread!.post_id);
    if (!isAuthor) {
      await sendReplyMessage(post!.author_id, message);
    } else {
      await sendReplyMessage(thread!.user_id, message);
    }

    res.status(200).json({ status: "ok", data: {} });
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
