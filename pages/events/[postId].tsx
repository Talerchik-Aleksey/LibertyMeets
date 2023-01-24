import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import ThreadForm from "../../Components/Posts/ThreadForm";
import Thread from "../../Components/Posts/Thread";

type SinglePostProps = { appUrl: string };
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

export default function SinglePost({ appUrl }: SinglePostProps) {
  const [editPost, setEditPost] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [post, setPost] = useState<PostType>();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
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

  const { postId } = router.query as QueryType;

  useEffect(() => {
    (async () => {
      const postId = router.query.postId;
      if (!postId) {
        return;
      }
      try {
        const res = await axios.get(`${appUrl}/api/posts/getPost`, {
          params: { postId },
        });
        if (res.status === 200) {
          if (session && res.data.data.author_id === session.user.id) {
            setEditPost(true);
          }
          setPost(res.data.data);
          const arr = res.data.data.geo?.split(",");
          if (arr) {
            setShowMap(true);
            setLat(parseFloat(arr[0]));
            setLng(parseFloat(arr[1]));
          }
        }
      } catch (err) {
        const error = err as AxiosError;
        const response = error.response;
        setErrorMessage((response?.data as ErrorResponse).status);
      }
    })();
  }, [appUrl, router, session]);

  async function deletePost() {
    try {
      const res = await axios.post(`${appUrl}/api/posts/deletePost`, {
        postId: router.query.postId,
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
        postId: router.query.postId,
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

  return (
    <>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : (
        <div style={{ height: "897px" }}>
          <div style={{ display: "flex" }}>
            <div>My Post</div>
            {editPost ? (
              <>
                <div
                  style={{ paddingLeft: 30, paddingRight: 30 }}
                  onClick={() => setShowList(!showList)}
                >
                  Edit
                </div>
                {showList ? (
                  <div>
                    <div onClick={goToEditPage}>Edit</div>
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
          {showMap ? (
            <div style={{ paddingBottom: 20 }}>
              Location
              <Map lat={lat} lng={lng} />
            </div>
          ) : (
            <></>
          )}
          <Thread
            appUrl={appUrl}
            threadId={"d80d7d19-3cbc-4c45-820e-2da8fd9714e2"}
          />
          <ThreadForm
            isThreadExists={false}
            appUrl={appUrl}
            postId={+postId}
            isAuthor={
              session ? post?.author_id === session?.user.id : undefined
            }
          />
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
