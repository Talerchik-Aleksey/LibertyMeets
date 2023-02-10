import type { NextApiRequest, NextApiResponse } from "next";
import { sendVerificationByEmail } from "../../../services/email";
import { getEmailVerificationToken } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";

type ResType = {
  message: string;
};

type BodyType = {
  email: string;
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

    const { email } = req.body as BodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    const email_verification_token = await getEmailVerificationToken(email);
    if (!email_verification_token) {
      throw new HttpError(400, "no email_verification_token");
    }
    const url = process.env.NEXTAUTH_URL;
    if (!url) {
      throw new HttpError(404, "Web site not found");
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/account/verification/${email_verification_token}`;
    const supportEmail = config.get<string>("emails.supportEmail");

    await sendVerificationByEmail(email, verificationUrl, supportEmail);
    res.status(200).json({ message: "success resend" });
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
