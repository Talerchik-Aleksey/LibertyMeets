import addressparser from "addressparser";
import { Threads } from "../models/threads";
import { getPost } from "./posts";
import { getThreadById } from "./threads";
import { getUser } from "./users";
import { handleReplyToThread } from "./reply";
import { getTextMessageFromEmailPayload } from "../utils/mailgun-payload";
import { extractThreadIdFromHeaderStr } from "../utils/mime-headers";
import { removeTagsFromEmail } from "../utils/stringUtils";

type MailgunIncomingMessage = Record<string, string>;

const tryToFindThread = async (references: string) => {
  let threadId = extractThreadIdFromHeaderStr(references);
  if (!threadId) {
    return null;
  }
  const thread = await getThreadById(threadId);
  if (!thread) {
    return null;
  }

  return thread;
};

const processReplyToThread = async (
  thread: Threads,
  payload: MailgunIncomingMessage
) => {
  // detect who is sending this email to us
  const fromStr = payload["From"] || payload["from"] || "";
  const addresses = addressparser(fromStr);
  if (!addresses || !addresses.length || !addresses[0].address) {
    return null;
  }
  const fromEmail = addresses[0].address;

  const post = await getPost(thread.post_id);
  if (!post) {
    return null;
  }

  const author = await getUser(post.author_id);
  if (!author) {
    return null;
  }
  const threadStarter = await getUser(thread.user_id);
  if (!threadStarter) {
    return null;
  }

  let userId: number | undefined = undefined;
  if (
    author.email === fromEmail ||
    author.email === removeTagsFromEmail(fromEmail)
  ) {
    userId = author.id;
  }
  if (
    threadStarter.email === fromEmail ||
    threadStarter.email === removeTagsFromEmail(fromEmail)
  ) {
    userId = threadStarter.id;
  }
  if (!userId) {
    return null;
  }

  const emails = [author.email, threadStarter.email];
  const emailsWithoutTags: string[] = [];

  emails.forEach((email) => {
    emailsWithoutTags.push(removeTagsFromEmail(email));
  });

  const permissibleEmails = [...emails, ...emailsWithoutTags];

  // Email sender should be either post owner (author) or tread starter (stranger)
  if (!permissibleEmails.includes(fromEmail)) {
    return null;
  }

  let message = await getTextMessageFromEmailPayload(payload);
  if (!message) {
    return null;
  }

  await handleReplyToThread(userId, thread, message);
};

export const handleWebhook = async (payload: MailgunIncomingMessage) => {
  // 1. detect if this message is reply to one of our message, then - execute logic to create response to thread
  // 2. otherwise - ignore it

  let thread;
  if (payload["References"]) {
    thread = await tryToFindThread(payload["References"]);
  }

  if (thread) {
    await processReplyToThread(thread, payload);
  }
};
