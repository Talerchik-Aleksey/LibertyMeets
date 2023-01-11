import type { NextApiRequest, NextApiResponse } from "next";
import { changePassword } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type resType = {
  message: string;
};

type bodyType = {
  token: string;
  password: string;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<resType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
    }

    const { token, password } = req.body as bodyType;

    if (!token) {
      throw new HttpError(400, "no email");
    }
    if (!password) {
      throw new HttpError(400, "no password");
    }

    const isUser = await changePassword(password, token);

    if (!isUser) {
      res.status(204).json({ message: "this user not found"});
    }

    res.status(200).json({ message: "success reset password"});
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
