import type { NextApiRequest, NextApiResponse } from "next";
import { fillToken, findUser } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { v4 } from "uuid";

type ResType = {
  message: string;
  token?: string;
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
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const { email } = req.body as BodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    const foundUser = await findUser(email);

    if (foundUser) {
      const reset_pwd_token = v4();
      await fillToken(email, reset_pwd_token);
      res.status(200).json({ message: "success create reset token", token: reset_pwd_token });
    }

    if (!foundUser) {
      res.status(403).json({ message: "email is not exists"});
    }
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
