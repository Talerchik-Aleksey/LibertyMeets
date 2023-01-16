import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../utils/HttpError";
import config from "config";

type ResType = {
  message: string;
};

type BodyType = {
  recaptchaValue: string;
};

const RECAPTCHA_SECRET_KEY = config.get<string>("recaptcha.recaptcha_key");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const { recaptchaValue } = req.body as BodyType;

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`
    );

    if (!response.data.success) {
      throw new HttpError(422, "Invalid captcha code");
    }

    res.status(200).json({ message: "OK" });
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
