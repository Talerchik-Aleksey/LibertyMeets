import { useState } from "react";
import config from "config";
import { GetServerSideProps } from "next";
import { getPost } from "../../../services/posts";
import { backendLoader } from "../../../utils/backend-loader";
import EditPage from "../../../Components/PostPage/EditPage/EditPage";
import type { Posts } from "../../../models/posts";

type PropsType = { appUrl: string; post: PostType };
type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  created_at: Date;
  category: string;
  description: string;
  is_public: boolean;
};

export default function EditPost({ appUrl, post: initialPost }: PropsType) {
  const [post, setPost] = useState<PostType>(initialPost);

  return <EditPage appUrl={appUrl} post={post} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");

  const postId = Number(ctx.query.postId);
  if (!postId || isNaN(postId)) {
    return {
      notFound: true,
    };
  }

  const post = await backendLoader<Posts>(
    () => getPost(postId),
    ["created_at"]
  );

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { appUrl, post },
  };
};
