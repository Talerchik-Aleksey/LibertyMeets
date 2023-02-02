import config from "config";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ThreadForm from "../../Components/Posts/ThreadForm";
import Thread from "../../Components/Posts/Thread";
import AuthorThreads from "../../Components/Posts/AuthorThreads";
import { getPost } from "../../services/posts";
import { backendLoader } from "../../utils/backend-loader";
import type { Posts } from "../../models/posts";
import MyPost from "../../Components/PostPage/MyPost/MyPost";
import LivePost from "../../Components/PostPage/LivePost/LivePost";

type SinglePostProps = { appUrl: string; post: PostType };

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

export default function SinglePost({
  appUrl,
  post: initialPost,
}: SinglePostProps) {
  const [post, setPost] = useState<PostType>(initialPost);
  const { data: session } = useSession();

  const isAuthor = session ? post?.author_id === session?.user.id : undefined;

  return (
    <>
      {isAuthor ? (
        <>
          <MyPost appUrl={appUrl} post={post} />
          {/* <AuthorThreads appUrl={appUrl} postId={post.id} /> */}
        </>
      ) : (
        <>
          <LivePost appUrl={appUrl} post={post} />
          <Thread appUrl={appUrl} userId={session?.user.id} postId={post.id} />
          {/* <ThreadForm
            isThreadExists={false}
            appUrl={appUrl}
            postId={post.id}
            threadId={"1"}
            isAuthor={isAuthor}
          /> */}
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<SinglePostProps> = async (
  ctx
) => {
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
    props: {
      appUrl,
      post,
    },
  };
};
