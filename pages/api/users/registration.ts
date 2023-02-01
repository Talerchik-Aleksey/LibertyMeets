import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { sendVerificationByEmail } from "../../../services/email";
import { Siteverify } from "../../../services/recaptcha";
import { fillEmailToken, saveUserToDatabase } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { validateEmail } from "../../../utils/stringUtils";

type ResType = {
  message: string;
};

type BodyType = {
  email: string;
  password: string;
  recaptchaValue: string;
};

connect();

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

    const email_verification_token = v4();
    await saveUserToDatabase({ email, password });
    await fillEmailToken(email, email_verification_token);

    const url = process.env.NEXTAUTH_URL;
    if (!url) {
      throw new HttpError(404, "Web site not found");
    }

    await sendVerificationByEmail(email, email_verification_token, url);
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
