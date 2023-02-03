import config from "config";
import { Threads } from "../models/threads";
import { HttpError } from "../utils/HttpError";
import { sendEmail } from "../utils/mailgun";
import { simpleTextToHtml } from "../utils/html";
import { getUser } from "./users";

export async function sendReplyMessage(userId: number, message: string) {
  const user = await getUser(userId);
  if (!user) {
    throw new HttpError(404, "user not found");
  }

  await sendEmail(
    "reply",
    {
      to: {
        name: undefined,
        email: user.email,
      },
    },
    { message }
  );
}

export async function sendReplyMessageToThread(
  userId: number,
  message: string,
  thread: Threads
) {
  const user = await getUser(userId);
  if (!user) {
    throw new HttpError(404, "user not found");
  }

  const baseDomain = config.get<string>("emails.replySetup.baseDomain");

  await sendEmail(
    "reply",
    {
      to: {
        name: undefined,
        email: user.email,
      },
    },
    { message: simpleTextToHtml(message) },
    [
      ["In-Reply-To", `<${thread.id}@${baseDomain}>`],
      ["References", `<${thread.id}@${baseDomain}>`],
    ]
  );
}

export async function sendResetPasswordLink(
  userId: number,
  resetUrl: string,
  supportEmail: string
) {
  const user = await getUser(userId);
  if (!user) {
    throw new HttpError(404, "user not found");
  }

  await sendEmail(
    "reset-password",
    {
      to: {
        name: undefined,
        email: user.email,
      },
    },
    { resetUrl, supportEmail }
  );
}

export async function sendVerificationByEmail(
  email: string,
  resetUrl: string,
  supportEmail: string
) {
  await sendEmail(
    "verification",
    {
      to: {
        name: undefined,
        email: email,
      },
    },
    { resetUrl, supportEmail }
  );
}
