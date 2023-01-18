import { Threads } from "../models/threadMessages";

export async function getThreads(postId: number) {
  const foundThreads = Threads.findAll({ where: { post_id: postId } });
  return foundThreads;
}
