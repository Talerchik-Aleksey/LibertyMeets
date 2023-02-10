import { FavoritePosts } from "../models/favoritePosts";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { PostType } from "../types/general";
import config from "config";
import { Threads } from "../models/threads";
import { ThreadMessages } from "../models/threadMessages";
import { Op, Sequelize, Transaction } from "sequelize";
import { connect } from "../utils/db";
import { CovertStringCoordinates } from "../utils/covnverterForCoordinates";

const PAGE_SIZE = config.get<number>("posts.perPage");

connect();

export async function savePostToDb({
  user,
  post,
}: {
  user: { id: number; email: string };
  post: PostType;
}) {
  const createdPost = await Posts.create({
    author_id: user.id,
    title: post.title,
    category: post.category,
    description: post.description,
    is_public: post.is_public,
    geo: Sequelize.fn(
      "ST_SetSRID",
      Sequelize.fn("ST_MakePoint", post.lng, post.lat),
      4326
    ),
    lat: post.lat,
    lng: post.lng,
    location_name: post.location_name,
    city: post.city,
    zip: post.zip,
    state: post.state,
    street: post.street,
  });
  await UserPosts.create({ user_id: user.id, post_id: createdPost.id });
  return createdPost;
}

type getPostsTypes = {
  category?: string | string[] | undefined;
  is_blocked: boolean | string[] | undefined;
  zip?: string | string[] | undefined;
  id?: number[];
};

type SearchProps = {
  page?: number;
  category?: string | string[] | undefined;
  zip?: string | string[] | undefined;
  lat?: string | string[] | undefined;
  lng?: string | string[] | undefined;
  radius?: string | string[] | undefined;
};

async function fillSearchParams(
  serarchParams: SearchProps,
  info: getPostsTypes & SearchProps
) {
  if (serarchParams.zip) {
    info.zip = serarchParams.zip;
  }
  if (serarchParams.category) {
    info.category = serarchParams.category;
  }
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const earthRadius = 3959; // miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

async function searchPostsWithGeoRadius(
  searchParams: SearchProps,
  user: { id: number } | null | undefined,
  info: getPostsTypes & SearchProps
) {
  console.log(searchParams);
  return await Posts.findAll({
    where: Sequelize.and(
      Sequelize.fn(
        "ST_DWithin",
        Sequelize.fn("ST_MakePoint", searchParams.lat, searchParams.lat),
        Sequelize.col("geo"),
        searchParams.radius
      ),
      info
    ),
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * ((searchParams?.page || 1) - 1),
    order: [
      ["created_at", "DESC"],
      ["title", "ASC"],
    ],
    include: {
      model: FavoritePosts,
      as: "favoriteUsers",
      where: { user_id: user?.id },
      required: false,
      attributes: ["id", "user_id", "post_id"],
    },
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "created_at",
      "author_id",
      "city",
      "state",
      "location_name",
      "zip",
    ],
  });
}

async function searchPostsWithoutGeo(
  searchParams: SearchProps | undefined,
  user: { id: number } | null | undefined,
  info: getPostsTypes & SearchProps
) {
  return await Posts.findAll({
    where: {
      ...info,
    },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * ((searchParams?.page || 1) - 1),
    order: [
      ["created_at", "DESC"],
      ["title", "ASC"],
    ],
    include: {
      model: FavoritePosts,
      as: "favoriteUsers",
      where: { user_id: user?.id },
      required: false,
      attributes: ["id", "user_id", "post_id"],
    },
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "created_at",
      "author_id",
      "city",
      "state",
      "location_name",
      "zip",
    ],
  });
}

export async function getPosts(
  user?: { id: number } | null | undefined,
  searchParams?: SearchProps
) {
  try {
    const info: getPostsTypes & SearchProps = {
      is_blocked: false,
    };

    if (searchParams) {
      await fillSearchParams(searchParams, info);
    }

    if (user) {
      if (
        searchParams &&
        searchParams.lat &&
        searchParams.lng &&
        searchParams.radius
      ) {
        const posts = await searchPostsWithGeoRadius(searchParams, user, info);
        const count = await Posts.count({
          where: info,
        });

        return { posts, count };
      }

      const posts = await searchPostsWithoutGeo(searchParams, user, info);
      const count = await Posts.count({
        where: info,
      });

      return { posts, count };
    }

    const posts = await Posts.findAll({
      where: info,
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * ((searchParams?.page || 1) - 1),
      order: [
        ["created_at", "DESC"],
        ["title", "ASC"],
      ],
      attributes: [
        "id",
        "title",
        "category",
        "description",
        "is_public",
        "geo",
        "created_at",
        "author_id",
        "city",
        "state",
        "location_name",
        "zip",
      ],
    });
    const count = await Posts.count({
      where: info,
    });
    return { posts, count };
  } catch (e) {
    console.log(e);
  }
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

export async function getFavoritePosts(
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
    where: { id: ids, is_blocked: false },
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "created_at",
      "author_id",
      "city",
      "state",
      "location_name",
    ],
  });

  return { posts, count: ids.length };
}

export async function getPost(postId: number) {
  const post = await Posts.findOne({
    where: {
      id: postId,
    },
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "author_id",
      "created_at",
      "is_blocked",
    ],
  });

  return post;
}

export async function getUserPosts(page: number, userId: number) {
  const userPosts = await Posts.findAll({
    where: { author_id: userId },
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    attributes: [
      "id",
      "title",
      "category",
      "description",
      "is_public",
      "geo",
      "created_at",
      "author_id",
      "is_blocked",
      "city",
      "state",
      "location_name",
    ],
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

  return Boolean(foundPost);
}

export async function deletePost(
  userId: number,
  postId: number,
  t: Transaction
) {
  try {
    await UserPosts.destroy({ where: { post_id: postId }, transaction: t });

    await FavoritePosts.destroy({
      where: {
        user_id: userId,
        post_id: postId,
      },
      transaction: t,
    });

    const thread = await Threads.findOne({
      where: { post_id: postId },
      transaction: t,
    });

    await Posts.destroy({
      where: {
        id: postId,
      },
      transaction: t,
    });

    if (!thread) {
      return;
    }

    await ThreadMessages.destroy({
      where: { thread_id: thread.id },
      transaction: t,
    });

    await Threads.destroy({ where: { post_id: postId }, transaction: t });

    return;
  } catch (err) {
    const error = err as Error;
    return error;
  }
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

export async function editPost(
  postId: number,
  postTitle: string,
  postCategory: string,
  postDescription: string
) {
  const res = await Posts.update(
    { title: postTitle, category: postCategory, description: postDescription },
    {
      where: { id: postId },
    }
  );
}

export async function deletePosts(userId: number, t: Transaction) {
  try {
    const posts = await Posts.findAll({
      where: { author_id: userId },
      transaction: t,
    });

    if (posts.length === 0) {
      return;
    }
    const postIds = posts.map((item) => item.id);

    await Posts.destroy({
      where: {
        author_id: userId,
      },
      transaction: t,
    });

    const thread = await Threads.findAll({
      where: { post_id: postIds },
      transaction: t,
    });
    if (thread.length === 0) {
      return;
    }

    const threadIds = thread.map((item) => item.id);
    await ThreadMessages.destroy({
      where: { thread_id: threadIds },
      transaction: t,
    });

    await Threads.destroy({ where: { post_id: postIds }, transaction: t });

    return;
  } catch (err) {
    const error = err as Error;
    return error;
  }
}
