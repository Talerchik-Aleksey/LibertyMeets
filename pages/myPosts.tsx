import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import config from "config";
import { useRouter } from "next/router";
import { Pagination } from "antd";

type PropsType = { appUrl: string; postsPerPage: number };
type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  geo: string;
  event_time: Date;
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

  const routeHandler = (post_id: number) => {
    // navigation to post (url need to be fixed)
    // router.push(`${appUrl}/pages/${post_id}`);
  };

  const handlerPagination = (page: number) => {
    router.query.page = page + "";
    router.push(router);
  };

  return (
    <>
      {myPosts.map((item) => (
        <div key={`post ${item.id}`} onClick={() => routeHandler(item.id)}>
          {item.event_time} {item.category} {item.title} {item.geo}
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
