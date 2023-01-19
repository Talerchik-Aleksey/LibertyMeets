import { FavoritePosts } from "../models/favoritePosts";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { PostType } from "../types/general";
import config from "config";
import userPosts from "../pages/api/posts/get-userPosts";
import { HttpError } from "../utils/HttpError";

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
    event_time: new Date(),
  });

  await UserPosts.create({ user_id: user.id, post_id: createdPost.id });
  return createdPost;
}

export async function getPosts(
  page: number,
  user: { id: number } | null | undefined,
  category: string | undefined
) {
  if (user) {
    const info = category ? { category } : undefined;
    const posts = await Posts.findAll({
      where: info,
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * (page - 1),
      include: {
        model: FavoritePosts,
        as: "favoriteUsers",
        where: { user_id: user.id },
        required: false,
      },
    });
    const count = await Posts.count({
      where: info,
    });
    return { posts, count };
  }

  const info = category ? { is_public: true, category } : { is_public: true };

  const posts = await Posts.findAll({
    where: info,
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
  });
  const count = await Posts.count({ where: info });
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

export async function getFavoritesPosts(
  page: number,
  user: { id: number } | null | undefined
) {
  const favPosts = await FavoritePosts.findAll({
    where: {
      user_id: user?.id,
    },
    attributes: ["post_id"],
  });
  const ids = favPosts.map((item) => item.post_id);
  const posts = await Posts.findAll({
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    where: { id: ids },
  });

  return { posts, count: ids.length };
}

export async function getPost(postId: number) {
  const post = await Posts.findOne({
    where: {
      id: postId,
    },
    attributes: [
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "event_time",
      "author_id",
    ],
  });

  return post;
}

export async function getUserPosts(page: number, userId: number) {
  const userPosts = await Posts.findAll({
    where: { author_id: userId },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
  });

  const count = await Posts.count({ where: { author_id: userId } });

  return { userPosts, count };
}

export async function isAuthorCheck(
  userId: number,
  postId: number
): Promise<boolean> {
  const foundPost = await Posts.findOne({
    where: { id: postId, author_id: userId },
  });
  return !!foundPost;
}

export async function deletePostInDb(userId: number, postId: number) {
  const res = await Posts.destroy({
    where: { id: postId },
  });
  if (!res) {
    throw new HttpError(404, "no success");
  }
  await FavoritePosts.destroy({ where: { user_id: userId, post_id: postId } });
}

export async function changePostVisible(
  userId: number,
  postId: number,
  is_public: boolean
) {
  await Posts.update(
    { is_public },
    {
      where: { author_id: userId, id: postId },
    }
  );
}
