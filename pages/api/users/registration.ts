import type { NextApiRequest, NextApiResponse } from "next";
import { saveUserToDatabase } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { validateEmail } from "../../../utils/stringUtils";

type resType = {
  message: string;
};

type bodyType = {
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<resType>
) {
  await connect();
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405).json({ message: "only POST request is available" });
    }

    const { email, password } = req.body as bodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    if (!password) {
      throw new HttpError(400, "no password");
    }

    if (!validateEmail(email)) {
      throw new HttpError(400, "invalid email");
    }

    await saveUserToDatabase({ email, password });
    res.status(200).json({ message: "success registration" });
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
