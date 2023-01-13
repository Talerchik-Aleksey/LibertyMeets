import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { Posts } from "../models/posts";
import { useRouter } from "next/router";
import { Pagination } from "antd";

type PropsType = { appUrl: string };

export default function PostsPage({ appUrl }: PropsType) {
  const [posts, setPosts] = useState<Posts[]>([]);
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
  }, [page]);

  const handlerPagination = (page: number, pageSize: number) => {
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
        total={500}
        defaultPageSize={20}
        showSizeChanger={false}
        onChange={handlerPagination}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
