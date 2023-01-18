import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

type SinglePostProps = { appUrl: string };
type ErrorResponse = {
  message: string;
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
        setErrorMessage((response?.data as ErrorResponse).message);
      }
    })();
  }, [appUrl, router, session]);

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
                    <div>Edit</div>
                    <div>Make public</div>
                    <div>Delete</div>
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
            This post is currently {post?.is_public ? "public" : ""}
          </div>
          {showMap ? (
            <div style={{ paddingBottom: 20 }}>
              Location
              <Map lat={lat} lng={lng} />
            </div>
          ) : (
            <></>
          )}
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
