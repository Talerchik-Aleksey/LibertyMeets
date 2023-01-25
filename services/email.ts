import config from "config";
import { Posts } from "../models/posts";
import { HttpError } from "../utils/HttpError";
import { sendEmail } from "../utils/mailgun";
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

export async function sendReplyMessageToPost(userId: number, message: string, post: Posts) {
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
    { message },
    [
      ['In-Reply-To', `<${post.id}@${baseDomain}>`],
      ['References', `<${post.id}@${baseDomain}>`],
    ]
  );
}
