import type { NextApiRequest, NextApiResponse } from "next";
import { getUserStatus, isRightToken } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type ResType = {
  message: string;
};

type BodyType = {
  email: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    const { email } = req.query as BodyType;
    if (!email) {
      throw new HttpError(400, "no email");
    }

    const isEnabled = await getUserStatus(email);

    if (isEnabled) {
      res.status(200).json({ message: "success" });
      return;
    }

    res.status(401).json({ message: "User email unauthorized" });
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
