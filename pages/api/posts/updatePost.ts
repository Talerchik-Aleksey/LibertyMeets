import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { changePostVisible } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { errorResponse } from "../../../utils/response";

type ResType = {
  status: string;
};

type BodyType = {
  postId: number;
  is_public: boolean;
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
    req.log.debug({ body: req.body }, "Request.body");

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const body = req.body as BodyType;
    const { postId, is_public } = body;

    await changePostVisible(session.user.id, postId, is_public);

    res.status(200).json({ status: "ok" });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
