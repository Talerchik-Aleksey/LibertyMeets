import type { NextApiRequest, NextApiResponse } from "next";
import { isEmailAlreadyUsed } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type bodyType = {
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();
  try {
    const { email } = req.body as bodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    const isUsed = await isEmailAlreadyUsed(email);

    if (!isUsed) {
      res.status(204).json({ message: "this email not recognised"});
    }
    res.status(200).json({ message: "success"});
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
