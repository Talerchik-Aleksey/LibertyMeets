import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import config from "config";

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

export default function MyPosts({ appUrl }: PropsType) {
  const [myPosts, setMyPosts] = useState<PostType[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/posts/userPosts`);
      setMyPosts(res.data.data.posts);
    })();
  }, []);

  return (
    <>
      {myPosts.map((item) => (
        <div key={`post ${item.id}`}>
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
