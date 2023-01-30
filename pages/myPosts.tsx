import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import config from "config";
import { useRouter } from "next/router";
import { Pagination } from "antd";
import { Button } from "antd";

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

export default function MyPosts({ appUrl, postsPerPage }: PropsType) {
  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter();

  let page = 1;
  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/posts/get-userPosts`, {
        params: { page },
      });
      setMyPosts(res.data.data.posts.userPosts);
      setTotalCount(res.data.data.posts.count);
    })();
  }, [page, appUrl]);

  const goToPostPage = (post_id: number) => {
    router.push(`${appUrl}/posts/${post_id}`);
  };

  const handleClick = (path: string) => {
    router.push(`${appUrl}/${path}`);
  };

  const handlerPagination = (page: number) => {
    router.push({
      pathname: `${appUrl}/myPosts`,
      query: { page },
    });
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
      {myPosts.map((item) => (
        <div key={`post ${item.id}`} onClick={() => goToPostPage(item.id)}>
          <p>{item.category}</p>
          <p>{item.title}</p>
          <p>{item.geo}</p>
          <p>{item.event_time.toString()}</p>
          <hr />
        </div>
      ))}

      <Pagination
        current={page}
        total={totalCount}
        defaultPageSize={postsPerPage}
        showSizeChanger={false}
        onChange={handlerPagination}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const appUrl = config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");

  return {
    props: { appUrl, postsPerPage },
  };
};
