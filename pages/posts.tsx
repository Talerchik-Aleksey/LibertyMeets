import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type propsType = { appUrl: string };
type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  geo: string;
  event_time: Date;
  category: string;
  favoriteUsers: { id: number }[];
};

export default function PostsPage({ appUrl }: propsType) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const router = useRouter();

  let page = 1;
  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/events`, {
        params: { page },
      });
      setPosts(res.data.data);
    })();
  }, []);

  async function changeStar(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);
    const currentPosts = posts;
    const foundPost = currentPosts.find((item) => item.id === postId);
    if (!foundPost) {
      return;
    }
    foundPost.is_favorite = res.data.data.isFavorite;
    foundPost.favoriteUsers = [];

    setPosts([...currentPosts]);
    console.log(currentPosts.map((item) => item.is_favorite));
    console.log(foundPost.is_favorite);
  }

  return (
    <>
      {posts.map((item) => (
        <div key={`post ${item.id}`}>
          {item.favoriteUsers.length > 0 || item.is_favorite ? (
            <div
              onClick={() => {
                changeStar(item.id);
              }}
            >
              star{" "}
            </div>
          ) : (
            <div
              onClick={() => {
                changeStar(item.id);
              }}
            >
              no star
            </div>
          )}
          {item.category} {item.title} {item.geo} {item.event_time}
          <hr />
        </div>
      ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
