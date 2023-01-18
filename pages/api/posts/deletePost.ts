import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { deletePostInDb } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type ResType = {
  status: string;
  data?: any;
};

type BodyType = {
  postId: number;
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
    const body = req.body as BodyType;
    const { postId } = body;
    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const result = await deletePostInDb(session.user.id, postId);
    if (!result) {
      res.status(404).json({ status: "no success" });
      return;
    }

    res.status(200).json({ status: "ok" });
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
