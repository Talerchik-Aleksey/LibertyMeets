import type { NextApiRequest, NextApiResponse } from "next";
import { changePasswordByUserId, isPasswordUsed } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { getToken } from "next-auth/jwt";

type ResType = {
  message: string;
  token?: string;
};

type BodyType = {
  password: string;
};

connect();
const KEY = config.get<string>("secretKey");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const { password } = req.body as BodyType;

    if (!password) {
      throw new HttpError(400, "no password");
    }
    const token = await getToken({ req, secret: KEY });

    if (!token) {
      throw new HttpError(400, "user does not valid");
    }

    const isUsedPassword = await isPasswordUsed(token.id as number, password);

    if (isUsedPassword) {
      throw new HttpError(400, "password used");
    }

    await changePasswordByUserId( token.id as number, password );
    res.status(200).json({ message: "success change password" });
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
