import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { Posts } from "../models/posts";
import { useRouter } from "next/router";

type propsType = { appUrl: string };

export default function PostsPage({ appUrl }: propsType) {
  const [getPosts, setPosts] = useState<Posts[]>([]);
  const router = useRouter();

  let page = 1;
  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }
  console.log(page);
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/events`, {
        params: { page },
      });
      setPosts(res.data.data);
    })();
  }, []);

  return (
    <>
      {getPosts.map((item) => (
        <div>
          {item.category} {item.title} {item.geo} {item.event_time}
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
