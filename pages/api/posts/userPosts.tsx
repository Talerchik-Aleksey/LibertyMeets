import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";

type ResType = {
  status: string;
  data: any;
};

export default async function getUserPosts(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
}
