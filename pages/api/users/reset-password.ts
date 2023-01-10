import type { NextApiRequest, NextApiResponse } from "next";
import { createResetToken, isEmailAlreadyUsed } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { validateEmail } from "../../../utils/stringUtils";
import { v4 } from "uuid";

type resType = {
  message: string;
  token?: string;
};

type bodyType = {
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<resType>
) {
  await connect();
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
    }

    const { email } = req.body as bodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    if (!validateEmail(email)) {
      throw new HttpError(400, "invalid email");
    }

    // const isUsed = await isEmailAlreadyUsed(email);

    // if (isUsed) {
    //   const reset_pwd_token = v4();
    //   await createResetToken(email, reset_pwd_token);
    //   res.status(200).json({ message: "success create reset token", reset_pwd_token });
    // }

    // if (!isUsed) {
    //   res.status(400).json({ message: "this email not recognised"});
    // }
    // res.status(204).json({ message: "this email not recognised"});
    const reset_pwd_token = v4();
    res.status(200).json({ message: "success registration", token: reset_pwd_token });
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