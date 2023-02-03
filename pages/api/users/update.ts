import config from "config";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { changeLocation } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";

type ResType = {
  message: string;
};

type BodyType = {
  location: [lat: number, lng: number];
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
    }
    const { location } = req.body as BodyType;

    const token = await getToken({ req, secret: KEY });

    if (!token) {
      throw new HttpError(400, "user does not valid");
    }

    await changeLocation(token.id as number, location[0], location[1]);
    res.status(200).json({ message: "success update location" });
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
