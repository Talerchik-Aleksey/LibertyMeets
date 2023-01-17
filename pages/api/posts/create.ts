import type { NextApiRequest, NextApiResponse } from "next";
import { savePostToDb } from "../../../services/posts";
import { PostType } from "../../../types/general";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { getSession } from "next-auth/react";

type ResType = {
  status: string;
  data: any;
};

type BodyType = PostType;

connect();
const CATEGORIES = ["social", "volunteer", "professional", "campaigns"];
const APP_URL = config.get<string>("appUrl");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const body = req.body as BodyType;
    const { title, category, description } = body;

    if (!title || !category || !description || !body.isPublic) {
      throw new HttpError(400, "invalid body structure");
    }

    if (title.length < 4 || title.length > 28) {
      throw new HttpError(400, "invalid title length");
    }

    if (!CATEGORIES.includes(category)) {
      throw new HttpError(400, "invalid category");
    }

    if (description.length < 4 || description.length > 1024) {
      throw new HttpError(400, "invalid description length");
    }

    const session = await getSession({req})
    if (!session) {
      res.status(401);
      return;
    }

    const post = await savePostToDb({ user: session.user, post: body });
    res.status(200).json({ status: "ok", data: { postId: post.id } });
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
