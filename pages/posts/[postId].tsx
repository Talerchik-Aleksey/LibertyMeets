import config from "config";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { getPost } from "../../services/posts";
import { backendLoader } from "../../utils/backend-loader";
import type { Posts } from "../../models/posts";
import MyPost from "../../Components/PostPage/MyPost/MyPost";
import LivePost from "../../Components/PostPage/LivePost/LivePost";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import Head from "next/head";

type SinglePostProps = {
  session: Session | null;
  appUrl: string;
  post: PostType;
};

type PostType = Posts;

const SHARETHIS_TOKEN = process.env.SHARETHIS_TOKEN;

export default function SinglePost({
  session,
  appUrl,
  post: initialPost,
}: SinglePostProps) {
  const [post, setPost] = useState<PostType>(initialPost);
  const router = useRouter();
  const fromUrl = router.query.fromUrl?.toString();
  const isAuthor = session ? post?.author_id === session?.user.id : undefined;

  return (
    <>
      <Head>
        {typeof window !== "undefined" && (
          <>
            <script
              src={`https://buttons-config.sharethis.com/js/${SHARETHIS_TOKEN}.js`}
              async
            />
            <script
              type="text/javascript"
              src={`https://platform-api.sharethis.com/js/sharethis.js#property=${SHARETHIS_TOKEN}&product=sticky-share-buttons&source=platform`}
              async
            ></script>
          </>
        )}
      </Head>
      <div className="sharethis-sticky-share-buttons"></div>
      {isAuthor ? (
        <>
          <MyPost
            appUrl={appUrl}
            post={post}
            fromUrl={String(fromUrl)}
            session={session}
          />
          {/* <AuthorThreads appUrl={appUrl} postId={post.id} /> */}
        </>
      ) : (
        <>
          <LivePost appUrl={appUrl} post={post} session={session} />
          {/* <Thread appUrl={appUrl} userId={session?.user.id} postId={post.id} /> */}
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
  const session = await getSession({ req: ctx.req });

  const postId = Number(ctx.query.postId);
  if (!postId || isNaN(postId)) {
    return {
      notFound: true,
    };
  }

  const post = await backendLoader<Posts>(
    () => getPost(postId),
    ["created_at", "updated_at"]
  );

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      session,
      appUrl,
      post,
    },
  };
};
