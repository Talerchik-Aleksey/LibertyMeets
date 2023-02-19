import addressparser from "addressparser";
import { Threads } from "../models/threads";
import { getPost } from "./posts";
import { getThreadById } from "./threads";
import { findUser } from "./users";
import { handleReplyToThread } from "./reply";
import { getTextMessageFromEmailPayload } from "../utils/mailgun-payload";
import { extractThreadIdFromHeaderStr } from "../utils/mime-headers";

type MailgunIncomingMessage = Record<string, string>;

const tryToFindThread = async(references: string) => {
  let threadId = extractThreadIdFromHeaderStr(references);
  if (!threadId) {
    return null;
  }
  const thread = await getThreadById(threadId);
  if (!thread) {
    return null;
  }

  return thread;
}

const processReplyToThread = async (thread: Threads, payload: MailgunIncomingMessage) => {
  // detect who is sending this email to us
  const fromStr = payload["From"] || payload["from"] || "";
  const addresses = addressparser(fromStr);
  if (!addresses || !addresses.length || !addresses[0].address) {
    return null;
  }
  const fromEmail = addresses[0].address;
  const user = await findUser(fromEmail);
  if (!user) {
    return null;
  }

  const post = await getPost(thread.post_id);
  if (!post) {
    return null;
  }

  // Email sender should be either post owner (author) or tread starter (stranger)
  if (user.id !== post.author_id && user.id !== thread.user_id) {
    return null;
  }

  let message = await getTextMessageFromEmailPayload(payload);
  if (!message) {
    return null;
  }

  const messageId = payload['Message-Id'];

  // set received_message_id
  await handleReplyToThread(user.id, thread, message, true, messageId);
};


export const handleWebhook = async (payload: MailgunIncomingMessage) => {
// 1. detect if this message is reply to one of our message, then - execute logic to create response to thread
// 2. otherwise - ignore it

  let thread;
  if (payload['References']) {
    thread = await tryToFindThread(payload['References']);
  }

  if (thread) {
    await processReplyToThread(thread, payload);
  }
};
