import { FavoritePosts } from "../models/favoritePosts";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { PostType } from "../types/general";
import config from "config";

const PAGE_SIZE = config.get<number>("posts.perPage");

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
export async function getPosts(
  page: number,
  user: { id: number } | null | undefined
) {
  if (user) {
    const posts = await Posts.findAll({
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * (page - 1),
      include: {
        model: FavoritePosts,
        as: "favoriteUsers",
        where: { user_id: user.id },
        required: false,
      },
    });
    return posts;
  }

  const posts = await Posts.findAll({
    where: { is_public: true },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
  });
  const count = await Posts.count({ where });
  return { count, posts };
}

export async function changeFavoritePost(userId: number, postId: number) {
  const info = { user_id: userId, post_id: postId };
  const foundFav = await FavoritePosts.findOne({ where: info });

  if (foundFav) {
    await FavoritePosts.destroy({ where: info });
    return false;
  } else {
    await FavoritePosts.create(info);
    return true;
  }
}
