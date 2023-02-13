import type { NextApiResponse } from "next";
import { fillToken, findUser } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { v4 } from "uuid";
import { sendResetPasswordLink } from "../../../services/email";
import config from "config";
import { NextApiRequestWithLog } from "../../../types";

type ResType = {
  message: string;
  token?: string;
};

type BodyType = {
  email: string;
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

    const { email } = req.body as BodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    const foundUser = await findUser(email);

    if (foundUser) {
      const reset_pwd_token = v4();
      await fillToken(email, reset_pwd_token);

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/verify/${reset_pwd_token}`;
      const supportEmail = config.get<string>("emails.supportEmail");

      await sendResetPasswordLink(foundUser.id, resetUrl, supportEmail);

      res.status(200).json({
        message: "success create reset token",
        token: reset_pwd_token,
      });

      return;
    }

    if (!foundUser) {
      res.status(404).json({ message: "email is not exists" });
      return;
    }
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
