import type { NextApiRequest, NextApiResponse } from "next";
import { editPost } from "../../../services/posts";
import { HttpError } from "../../../utils/HttpError";
import { connect } from "../../../utils/db";

type ResType = {
  status: string;
  data: any;
};

type BodyType = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const CATEGORIES = ["social", "volunteer", "professional", "campaigns"];

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

    const body = req.body as BodyType;
    const { id, title, category, description } = body;

    if (!title || !category || !description) {
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

    const post = await editPost(id, title, category, description);
    res.status(200).json({ status: "ok", data: { postId: id } });
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
