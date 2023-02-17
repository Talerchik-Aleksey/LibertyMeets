import type { NextApiRequest, NextApiResponse } from "next";
import { Posts } from "../../../models/posts";
import { getPost } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { errorResponse } from "../../../utils/response";

type ResType = {
  status: string;
  data: Posts;
};

type QueryType = {
  postId: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    const query = req.query as QueryType;
    const postId = +query.postId;

    const post = await getPost(postId);
    if (!post) {
      throw new HttpError(404, "no post");
    }
    res.status(200).json({ status: "ok", data: post });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
