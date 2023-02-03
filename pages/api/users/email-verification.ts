import type { NextApiRequest, NextApiResponse } from "next";
import {
  changeEnabledForUser,
  isRightEmailToken,
} from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type BodyType = {
  token: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token } = req.body as BodyType;

    if (!token) {
      throw new HttpError(400, "no token");
    }

    const isUsed = await isRightEmailToken(token);

    if (!isUsed) {
      res.status(204).json({ message: "this email not recognised" });
      return;
    }

    await changeEnabledForUser(token);

    res.status(200).json({ message: "success" });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res.status(httpErr.httpCode).json({ message: httpErr.message });
      return;
    } else {
      const error = err as Error;
      res.status(500).json({ message: error.message });
      return;
    }
  }
}
