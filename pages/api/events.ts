import type { NextApiRequest, NextApiResponse } from "next";
import config from "config";
import { getPosts } from "../../services/posts";
import { getSession } from "next-auth/react";
import { connect } from "../../utils/db";
import { HttpError } from "../../utils/HttpError";

type resType = {
  status: string;
  data: any;
};

type queryType = {
  page: number | undefined;
};

connect();
const APP_URL = config.get<string>("appUrl");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<resType>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    let { page } = req.query as queryType;
    if (!page) {
      page = 1;
    }

    const session = await getSession({ req });

    const posts = await getPosts(page, session?.user);
    res.status(200).json({ status: "ok", data: posts });
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
