import { HttpError } from "../utils/HttpError";
import { isAuthorCheck } from "./posts";
import {
  createThread,
  createThreadMessage,
  getThread,
} from "./threads";
import { sendReplyMessageToPost } from "./email";
import { Posts } from "../models/posts";

export const handleReplyToPost = async (
  userId: number,
  post: Posts,
  message: string
) => {
  const postId = post.id;


  console.log(postId, userId);
  console.log('postId, userId');
  const isAuthor = await isAuthorCheck(userId, postId);

  let thread = await getThread(postId, userId);
  if (!thread) {
    // if user is stranger:
    //   - create new thread
    // if user is post owner:
    //   - error - post owner cannot create thread by himself
    if (isAuthor) {
      throw new HttpError(418, "author cannot start thread in his post");
    } else {
      thread = await createThread(postId, userId);
    }
  }

  // Check: only thread starter (stranger) OR post owner (author) can make reply
  if (!isAuthor && userId !== thread.user_id) {
    throw new HttpError(403, "Forbidden");
  }

  await createThreadMessage(thread!.id, userId, message);

  if (isAuthor) {
    await sendReplyMessageToPost(thread!.user_id, message, post);
  } else {
    await sendReplyMessageToPost(post.author_id, message, post);
  }

  return true;
};
