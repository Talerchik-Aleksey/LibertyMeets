import type { NextApiResponse } from "next";
import { changePassword } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { NextApiRequestWithLog } from "../../../types";

type ResType = {
  message: string;
};

type BodyType = {
  token: string;
  password: string;
};

connect();

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

    const { token, password } = req.body as BodyType;

    if (!token) {
      throw new HttpError(400, "Invalid token");
    }
    if (!password) {
      throw new HttpError(400, "Invalid password");
    }

    const isUser = await changePassword(password, token);

    if (!isUser) {
      req.log.warn({ token }, "Attempt to update password but token not found");
      res.status(204).json({ message: "Invalid token"});
      return;
    }

    res.status(200).json({ message: "success reset password"});
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ message: httpErr.message });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ message: error.message });
      return;
    }
  }
}
