import type { NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { handleWebhook } from "../../../services/webhook";
import { NextApiRequestWithLog } from "../../../types";

type ResType = {
  status: string;
  data: any;
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

    req.log.info({ payload: req.body }, "Incoming Webhook Payload");
    await handleWebhook(req.body);

    res.status(200).json({ status: "ok", data: {} });
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
