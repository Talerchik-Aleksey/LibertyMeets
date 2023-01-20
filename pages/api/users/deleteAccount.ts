import type { NextApiRequest, NextApiResponse } from "next";
import { deleteAccount } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { getToken } from "next-auth/jwt";

type ResType = {
  message: string;
};

const sequelize = connect();
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

    const token = await getToken({ req, secret: KEY });

    if (!token) {
      throw new HttpError(400, "user does not valid");
    }

    const result = await deleteAccount(token.id as number, sequelize);
    if (result) {
      res.status(500).json({ message: result.message });
      return;
    }
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
