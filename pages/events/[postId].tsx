import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import ThreadForm from "../../Components/Posts/ThreadForm";
import Thread from "../../Components/Posts/Thread";
import AuthorThreads from "../../Components/Posts/AuthorThreads";
import { getPost } from "../../services/posts";
import { backendLoader } from "../../utils/backend-loader";
import type { Posts } from "../../models/posts";

type SinglePostProps = { appUrl: string, post: PostType };
type ErrorResponse = {
  status: string;
};
type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  event_time: Date;
  category: string;
  description: string;
  is_public: boolean;
};
type QueryType = {
  postId: string;
};

export default function SinglePost({ appUrl, post: initialPost }: SinglePostProps) {
  const [editPost, setEditPost] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [post, setPost] = useState<PostType>(initialPost);
  const { data: session } = useSession();
  const router = useRouter();
  const Map = useMemo(
    () =>
      dynamic(() => import("../../Components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  if (!post) {
    return null;
  }

  const postId = post.id;

  const coordinates = post.geo?.split(',');

  async function deletePost() {
    try {
      const res = await axios.post(`${appUrl}/api/posts/deletePost`, {
        postId,
      });
      if (res.status === 200) {
        router.push("/myPosts");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).status);
    }
  }

  async function makePublic(is_public: boolean) {
    try {
      const res = await axios.post(`${appUrl}/api/posts/updatePost`, {
        postId,
        is_public,
      });
      if (res.status === 200) {
        setPost({ ...post, is_public } as PostType);
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).status);
    }
  }

  const goToEditPage = () => {
    router.push(`${appUrl}/events/edit/${router.query.postId}`);
  };

  const isAuthor = session ? post?.author_id === session?.user.id : undefined;
  const canEditPost = isAuthor;

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div style={{ height: "897px" }}>
      <div style={{ display: "flex" }}>
        <div>My Post</div>
        {canEditPost ? (
          <>
            <div
              style={{ paddingLeft: 30, paddingRight: 30 }}
              onClick={() => setShowList(!showList)}
            >
              Edit
            </div>
            {showList ? (
              <div>
                <Link href={`/events/edit/${postId}`}>Edit</Link>
                <div onClick={() => makePublic(!post?.is_public)}>
                  Make public
                </div>
                <div onClick={deletePost}>Delete</div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div style={{ paddingBottom: 20 }}>
        TITLE
        <div>{post?.title}</div>
      </div>
      <div style={{ paddingBottom: 20 }}>
        CATEGORY
        <div>{post?.category}</div>
      </div>
      <div style={{ paddingBottom: 20 }}>
        DESCRIPTION
        <div>{post?.description}</div>
      </div>
      <div style={{ paddingBottom: 20 }}>
        This post is currently {post?.is_public ? "public" : "private"}
      </div>
      {coordinates && coordinates.length === 2 ? (
        <div style={{ paddingBottom: 20 }}>
          Location
          <Map lat={Number(coordinates[0])} lng={Number(coordinates[1])} />
        </div>
      ) : (
        <></>
      )}
      {isAuthor ? (
        <>
          <AuthorThreads appUrl={appUrl} postId={postId} />
        </>
      ) : (
        <>
          <Thread
            appUrl={appUrl}
            userId={session?.user.id}
            postId={postId}
          />
          <ThreadForm
            isThreadExists={false}
            appUrl={appUrl}
            postId={postId}
            threadId={'1'}
            isAuthor={isAuthor}
          />
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SinglePostProps> = async (ctx) => {
  const appUrl = config.get<string>("appUrl");

  const postId = Number(ctx.query.postId);
  if (!postId || isNaN(postId)) {
    return {
      notFound: true,
    };
  }

  const post = await backendLoader<Posts>(() => getPost(postId), ["event_time"]);
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
