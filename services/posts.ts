import { FavoritePosts } from "../models/favoritePosts";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { PostType } from "../types/general";

export async function savePostToDb({
  user,
  post,
}: {
  user: { id: number; email: string };
  post: PostType;
}) {
  let geo = undefined;
  if (post.lat && post.lng) {
    geo = `${post.lat}N, ${post.lng}W`;
  }

  const createdPost = await Posts.create({
    author_id: user.id,
    title: post.title,
    category: post.category,
    description: post.description,
    is_public: post.isPublic,
    geo: geo,
  });

  await UserPosts.create({ user_id: user.id, post_id: createdPost.id });
  return createdPost;
}

const PAGE_SIZE = 20;
export async function getPosts(page: number, isUserLoggedIn: boolean) {
  if (isUserLoggedIn) {
    const posts = await Posts.findAll({
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * (page - 1),
    });
    return posts;
  }

  const posts = await Posts.findAll({
    where: { is_public: true },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
  });
  return posts;
}

export async function changeFavoritePost(userId: number, postId: number) {
  const query = {
    where: { user_id: userId, post_id: postId },
  };
  const foundFav = await FavoritePosts.findOne(query);

  if (foundFav) {
    await FavoritePosts.destroy(query);
    return false;
  } else {
    await FavoritePosts.create(query);
    return true;
  }
}
