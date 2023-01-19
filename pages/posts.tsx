import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Pagination } from "antd";
import { CATEGORIES } from "../constants/constants";
import { isToday, isTomorrow } from "../utils/eventTimeStatus";

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

export default function PostsPage({ appUrl, postsPerPage }: PropsType) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const router = useRouter();

  let page = 1;
  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/events`, {
        params: { page, category },
      });
      setPosts(res.data.data.posts);
      setTotalCount(res.data.data.count);
    })();
  }, [page, category, appUrl]);

  const changePageNumber = (page: number) => {
    router.query.page = page + "";
    router.push(router);
  };

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

  function getPostsByDate(
    posts: PostType[],
    filterFn: (date: Date) => boolean
  ) {
    return posts.filter((post) => filterFn(new Date(post.event_time)));
  }

  function renderPosts(
    posts: PostType[],
    changeStar: (postId: number) => void
  ) {
    return posts.map((item) => (
      <div key={`post ${item.id}`}>
        {item.favoriteUsers?.length > 0 || item.is_favorite ? (
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
    ));
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        {CATEGORIES.map((item, index) => (
          <div
            style={{ padding: 20, cursor: "pointer" }}
            key={index}
            onClick={() => {
              setCategory(item);
              changePageNumber(1);
            }}
          >
            {item}
          </div>
        ))}
      </div>
      {getPostsByDate(posts, isToday).length > 0 && <h3>Today</h3>}
      {renderPosts(getPostsByDate(posts, isToday), changeStar)}
      {getPostsByDate(posts, isTomorrow).length > 0 && <h3>Tomorrow</h3>}
      {renderPosts(getPostsByDate(posts, isTomorrow), changeStar)}
      {getPostsByDate(posts, (date) => !isTomorrow(date) && !isToday(date))
        .length > 0 && <h3>Another</h3>}
      {renderPosts(
        getPostsByDate(posts, (date) => !isTomorrow(date) && !isToday(date)),
        changeStar
      )}
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
