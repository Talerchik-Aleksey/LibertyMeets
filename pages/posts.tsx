import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Pagination } from "antd";
import { CATEGORIES } from "../constants/constants";
import { isToday, isTomorrow } from "../utils/eventTimeStatus";
import { PostType } from "../types/general";
import PostListItem from "../Components/PostListItem";
import PostsList from "../Components/PostsList";
import { sendEmail } from "../utils/mailgun";

type PropsType = { appUrl: string; postsPerPage: number };

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
    router.push({
      pathname: `${appUrl}/posts`,
      query: { page },
    });
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
      <div>
        {getPostsByDate(posts, isToday).length > 0 && <h3>Today</h3>}
        <PostsList
          posts={getPostsByDate(posts, isToday)}
          appUrl={appUrl}
          changeStar={changeStar}
        />
        {getPostsByDate(posts, isTomorrow).length > 0 && <h3>Tomorrow</h3>}
        <PostsList
          posts={getPostsByDate(posts, isTomorrow)}
          appUrl={appUrl}
          changeStar={changeStar}
        />
        {getPostsByDate(posts, (date) => !isTomorrow(date) && !isToday(date))
          .length > 0 && <h3>Soon</h3>}

        <PostsList
          posts={getPostsByDate(
            posts,
            (date) => !isTomorrow(date) && !isToday(date)
          )}
          appUrl={appUrl}
          changeStar={changeStar}
        />
      </div>
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
  // const emailParams = {
  //   subject:"",
  //   to: {
  //     email: "rex.beer60@ethereal.email",
  //   },
  // };
  // await sendEmail("reset-password", emailParams, {user:{name:"MyName"}});

  const appUrl = config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");

  return {
    props: { appUrl, postsPerPage },
  };
};
