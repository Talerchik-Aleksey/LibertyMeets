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
export async function getPosts(page: number, isPublic: boolean) {
  // const posts = await Posts.findAll({
  //   where: { is_public: isPublic },
  //   limit: PAGE_SIZE,
  //   offset: PAGE_SIZE * (page - 1),
  // });

  // return posts;

  return [
    {
      title: "title1",
      category: "social",
      geo: "geo1",
      event_time: new Date(),
    },
    {
      title: "title1",
      category: "social",
      geo: "geo1",
      event_time: new Date(),
    },
    {
      title: "title1",
      category: "social",
      geo: "geo1",
      event_time: new Date(),
    },
    {
      title: "title1",
      category: "social",
      geo: "geo1",
      event_time: new Date(),
    },
    {
      title: "title1",
      category: "social",
      geo: "geo1",
      event_time: new Date(),
    },
    {
      title: "title1",
      category: "social",
      geo: "geo1",
      event_time: new Date(),
    },
    
  ];
}
