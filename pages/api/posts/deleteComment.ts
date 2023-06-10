import type { NextApiRequest, NextApiResponse } from "next";
import { deleteComment } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { errorResponse } from "../../../utils/response";

type QueryType = {
  commentId: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  req.log.info(`${req.method} ${req.url}`);
  try {
    if (req.method !== "POST") {
      return res.status(405);
    }

    req.log.debug({ body: req.body }, "Request.body");

    const { commentId } = req.body as QueryType;

    await deleteComment(+commentId);
    res.status(200).json({});
  } catch (error) {
    errorResponse(req, res, error);
  }
}
