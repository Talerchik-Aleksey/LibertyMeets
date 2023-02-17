import type { NextApiRequest, NextApiResponse } from "next";
import { isRightToken } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { errorResponse } from "../../../utils/response";

type ResType = {
  message: string;
};

type BodyType = {
  token: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    const { token } = req.body as BodyType;

    if (!token) {
      throw new HttpError(400, "no token");
    }

    const isUsed = await isRightToken(token);

    if (!isUsed) {
      res.status(204).json({ message: "this email not recognised" });
      return;
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
