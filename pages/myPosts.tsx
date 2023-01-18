import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import config from "config";
import { useRouter } from "next/router";

type PropsType = { appUrl: string };
type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  geo: string;
  event_time: Date;
  category: string;
  favoriteUsers: { id: number }[];
};

export default function MyPosts({ appUrl }: PropsType) {
  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/posts/get-userPosts`);
      setMyPosts(res.data.data.posts.userPosts);
    })();
  }, []);

  const routeHandler = (post_id: number) => {
    // navigation to post (url need to be fixed)
    // router.push(`${appUrl}/pages/${post_id}`);
  };

  return (
    <>
      {myPosts.map((item) => (
        <div key={`post ${item.id}`} onClick={() => routeHandler(item.id)}>
          {item.event_time} {item.category} {item.title} {item.geo}
        </div>
      ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const appUrl = config.get<string>("appUrl");

  return {
    props: { appUrl },
  };
};

