import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import { sendVerificationByEmail } from "../../../services/email";
import { Siteverify } from "../../../services/recaptcha";
import { fillEmailToken, saveUserToDatabase } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { validateEmail } from "../../../utils/stringUtils";
import config from "config";
import { Buffer } from "buffer";

type ResType = {
  message: string;
};

type BodyType = {
  email: string;
  password: string;
  recaptchaValue: string;
};

connect();

const v4 = (email: string): string => {
  return uuidv4() + Buffer.from(email).toString("hex");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const { email, password, recaptchaValue } = req.body as BodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    if (!password) {
      throw new HttpError(400, "no password");
    }

    if (!validateEmail(email)) {
      throw new HttpError(400, "invalid email");
    }

    const isSuccess = await Siteverify(recaptchaValue);

    if (!isSuccess) {
      throw new HttpError(422, "Invalid captcha code");
    }

    const email_verification_token = v4(email);
    console.log(email_verification_token);
    await saveUserToDatabase({ email, password });
    await fillEmailToken(email, email_verification_token);

    const url = process.env.NEXTAUTH_URL;
    if (!url) {
      throw new HttpError(404, "Web site not found");
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/account/verification/${email_verification_token}`;
    const supportEmail = config.get<string>("emails.supportEmail");

    await sendVerificationByEmail(email, verificationUrl, supportEmail);
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
