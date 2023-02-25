import { Posts } from "../models/posts";

function addingPostTitle(post: Posts) {
  return post.title.trim().toLowerCase().startsWith("draft:")
    ? post.title
    : `Draft: ${post.title}`;
}

export function checkPostTitile(title: string) {
  return title.trim().toLowerCase().startsWith("draft:")
    ? title
    : `Draft: ${title}`;
}

export function changeTitleByStatus(post: Posts, is_public: boolean) {
  return is_public ? post.title.slice(7) : addingPostTitle(post);
}
