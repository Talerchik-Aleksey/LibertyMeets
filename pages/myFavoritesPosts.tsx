import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Pagination } from "antd";

type PropsType = { appUrl: string; postsPerPage: number };
type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  geo: string;
  created_at: Date;
  category: string;
  favoriteUsers: { id: number }[];
};

export default function MyFavoritesPostsPage({
  appUrl,
  postsPerPage,
}: PropsType) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter();

  let page = 1;
  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/favorites`, {
        params: { page },
      });
      res.data.data.posts.forEach(
        (item: { is_favorite: boolean }) => (item.is_favorite = true)
      );
      setPosts(res.data.data.posts);
      setTotalCount(res.data.data.count);
    })();
  }, [page, appUrl]);

  const changePageNumber = (page: number) => {
    router.push({
      pathname: `${appUrl}/myFavoritesPosts`,
      query: { page },
    });
  };

  async function movePost(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);
    if (res.status === 200) {
      const currentPosts = posts.filter((item) => item.id !== postId);
      setPosts(currentPosts);
    }
  }

  const handleClick = (path: string) => {
    router.push(`${appUrl}/${path}`);
  };

  const goToPostPage = (post_id: number) => {
    router.push(`${appUrl}/events/${post_id}`);
  };

  return (
    <>
      <div>
        <Button type="text" onClick={() => handleClick("myFavoritesPosts")}>
          My Favorites
        </Button>
        <Button type="text" onClick={() => handleClick("myPosts")}>
          My Posts
        </Button>
        <Button type="text" onClick={() => handleClick("settings")}>
          Settings
        </Button>
      </div>
      {posts.map((item) => (
        <div key={`post ${item.id}`}>
          <div
            onClick={() => {
              movePost(item.id);
            }}
          >
            star{" "}
          </div>
          <div onClick={() => goToPostPage(item.id)}>
            <p>{item.category}</p>
            <p>{item.title}</p>
            <p>{item.geo}</p>
            <p>{item.created_at.toString()}</p>
            <hr />
          </div>
        </div>
      ))}
      <Pagination
        current={page}
        total={totalCount}
        defaultPageSize={postsPerPage}
        showSizeChanger={false}
        onChange={changePageNumber}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");

  return {
    props: { appUrl, postsPerPage },
  };
};
