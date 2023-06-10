import type { NextApiRequest, NextApiResponse } from "next";
import { createComment } from "../../../services/posts";
import { CommonApiResponse } from "../../../types/general";
import { connect } from "../../../utils/db";
import { errorResponse } from "../../../utils/response";

type Payload = {
  content: string;
  postId: number;
  userId: number;
  createdAt: Date;
  user: {
    email: string;
  };
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    const { content, postId, userId } = req.body;
    req.log.debug({ content, postId, userId }, "Request.body");

    if (!req.method || req.method !== "POST") {
      return res.status(405);
    }
    if (!content || !postId || !userId) {
      return res.status(400);
    }

    const comment = await createComment(userId, postId, content);
    if (!comment) {
      return res.status(400);
    }
    res.status(200).json({
      status: "ok",
      data: {
        content: comment.content,
        postId: comment.postId,
        userId: comment.userId,
        createdAt: comment.createdAt,
        user: {
          email: comment.user.email,
        },
      },
    });
  } catch (error) {
    errorResponse(req, res, error);
  }
}
