import type { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { deletePost } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { NextApiRequestWithLog } from "../../../types";

type ResType = {
  status: string;
  data?: any;
};

type BodyType = {
  postId: number;
};

const sequelize = connect();

export default async function handler(
  req: NextApiRequestWithLog,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }
    req.log.debug({ body: req.body }, "Request.body");

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const body = req.body as BodyType;
    const { postId } = body;

    await (
      await sequelize
    ).transaction(async (t) => {
      const result = await deletePost(session.user.id, postId, t);
      if (result) {
        res.status(500).json({ status: result.message });
        return;
      }

      res.status(200).json({ status: "ok" });
    });
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
