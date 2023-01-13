import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { Posts } from "../models/posts";
import { useRouter } from "next/router";
import { Pagination } from "antd";

type PropsType = { appUrl: string; postsPerPage: number };

export default function PostsPage({ appUrl, postsPerPage }: PropsType) {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
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
      setPosts(res.data.data.posts);
      setTotalCount(res.data.data.count)
    })();
  }, [page]);

  const handlerPagination = (page: number) => {
    router.query.page = page + "";
    router.push(router);
  };

  return (
    <>
      {posts.map((item) => (
        <div key={item.id}>
          {item.category} {item.title} {item.geo} {item.event_time}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");
  console.log(postsPerPage)
  return {
    props: { appUrl, postsPerPage },
  };
};
