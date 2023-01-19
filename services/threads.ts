import { Posts } from "../models/posts";
import { ThreadMessages } from "../models/threadMessages";
import { Threads } from "../models/threads";
import { HttpError } from "../utils/HttpError";

export async function getThreads(postId: number) {
  const foundThreads = Threads.findAll({ where: { post_id: postId } });
  return foundThreads;
}

export async function isUserCanView(threadId: string, userId: number) {
  const foundThread = await Threads.findOne({
    where: { id: threadId },
    include: { model: Posts, as: "post" },
  });
  if (!foundThread) {
    throw new HttpError(404, "thread not found");
  }
  const threadCreatorId = foundThread.user_id;
  const authorId = foundThread.post?.author_id;

  return userId === threadCreatorId || userId === authorId;
}

export async function getMessages(threadId: string) {
  const messages = await ThreadMessages.findAll({
    where: { thread_id: threadId },
  });

  return messages;
}
