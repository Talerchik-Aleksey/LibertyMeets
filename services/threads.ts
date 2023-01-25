import { Posts } from "../models/posts";
import { ThreadMessages } from "../models/threadMessages";
import { Threads } from "../models/threads";
import { HttpError } from "../utils/HttpError";
import { getPost } from "./posts";

export async function getThreads(postId: number) {
  const foundThreads = Threads.findAll({ where: { post_id: postId } });
  return foundThreads;
}

export async function getThreadById(id: string) {
  return Threads.findOne({
    where: { id },
  });
}

export async function getThread(postId: number, userId: number) {
  const foundThread = Threads.findOne({
    where: { post_id: postId, user_id: userId },
  });
  return foundThread;
}

export async function isUserCanView(threadId: string, userId: number) {
  const foundThread = await Threads.findOne({
    where: { id: threadId },
    //include: { model: Posts, as: "post" },
  });
  if (!foundThread) {
    throw new HttpError(404, "thread not found");
  }
  const threadCreatorId = foundThread.user_id;
  
  const post = await getPost(foundThread.post_id)
  const authorId = post!.author_id;

  return userId === threadCreatorId || userId === authorId;
}

export async function getMessages(threadId: string) {
  const messages = await ThreadMessages.findAll({
    where: { thread_id: threadId },
  });

  return messages;
}

export async function createThread(postId: number, userId: number) {
  const threadToSave = { user_id: userId, post_id: postId };
  const createdThread = await Threads.create(threadToSave);
  return createdThread;
}

export async function createThreadMessage(
  threadId: string,
  userId: number,
  message: string
) {
  const toCreate = { thread_id: threadId, user_id: userId, message };
  await ThreadMessages.create(toCreate);
}
