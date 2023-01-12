import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { changePasswordByUserId } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { Session } from "next-auth";

type ResType = {
  message: string;
  token?: string;
};

type BodyType = {
  password: string;
};

connect();
const APP_URL = config.get<string>("appUrl");

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

    const response = await axios.get(`${APP_URL}/api/auth/session`, {
      headers: { Cookie: req.headers.cookie },
    });

    const session = response.data as Session;
    if (!session || Object.keys(session).length === 0) {
      res.status(401);
      return;
    }

    await changePasswordByUserId( session.user.id, password );
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
