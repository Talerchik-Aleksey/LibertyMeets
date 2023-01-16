import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { saveUserToDatabase } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { validateEmail } from "../../../utils/stringUtils";
import config from "config";

type ResType = {
  message: string;
};

type BodyType = {
  email: string;
  password: string;
  recaptchaValue: string;
};

const RECAPTCHA_SECRET_KEY = config.get<string>("recaptcha.recaptcha_key");

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

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`
    );

    if (!response.data.success) {
      throw new HttpError(400, "reCAPTCHA error");
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
