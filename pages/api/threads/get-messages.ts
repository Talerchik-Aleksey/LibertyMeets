import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import {
  getMessages,
  getThreads,
  isUserCanView,
} from "../../../services/threads";

type ResType = {
  status: string;
  data: any;
};

type QueryType = {
  threadId: string | undefined;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    let { threadId } = req.query as QueryType;
    if (!threadId) {
      throw new HttpError(400, "no threadId");
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }
    const userId = session?.user.id;
    const isCanView = isUserCanView(threadId, session.user.id);
    if (!isCanView) {
      res.status(403);
      return;
    }

    const messages = await getMessages(threadId);
    res.status(200).json({ status: "ok", data: { messages: messages } });
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
