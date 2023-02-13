import type { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { changeLocation } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { NextApiRequestWithLog } from "../../../types";

type ResType = {
  message: string;
};

type BodyType = {
  location: [lat: number, lng: number];
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

    const { location } = req.body as BodyType;

    const session = await getSession({ req });

    if (!session?.user) {
      throw new HttpError(400, "user not valid");
    }

    await changeLocation(session.user.id as number, location[0], location[1]);

    res.status(200).json({ message: "success update location" });
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
