import { Pagination } from "antd";
import { useState, useEffect } from "react";
import AddListing from "../AddListing/AddListing";
import NavBar from "../General/NavBar/NavBar";
import { isToday, isTomorrow } from "../../utils/eventTimeStatus";
import styles from "./Events.module.scss";
import { useRouter } from "next/router";
import { PostType } from "../../types/general";
import PostsList from "../PostsList";
import axios from "axios";
import Header from "../General/Header";

type PropsType = { appUrl: string; postsPerPage: number };

export default function Events({ appUrl, postsPerPage }: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const [isViewForAllCategory, setisViewForAllCategory] =
    useState<boolean>(true);
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
      const res = await axios(`${appUrl}/api/events`, {
        method: "GET",
        mode: "no-cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "same-origin",
        params: { page, category },
      });
      if (category === "All" || category === undefined) {
        setisViewForAllCategory(true);
      } else {
        setisViewForAllCategory(false);
      }
      setPosts(res.data.data.posts);
      setTotalCount(res.data.data.count);
    })();
  }, [page, category, appUrl]);

  const changePageNumber = (page: number) => {
    setCurrent(page);
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
  }

  function getPostsByDate(
    posts: PostType[],
    filterFn: (date: Date) => boolean
  ) {
    return posts.filter((post) => filterFn(new Date(post.event_time)));
  }

  return (
    <div className={styles.eventsPageContainer}>
      <div className={styles.navigation}>
        <NavBar setCategory={setCategory} changePageNumber={changePageNumber} />
      </div>
      <div className={styles.wrap}>
        <div className={styles.container}>
          <div className={styles.eventsContainer}>
            <div className={styles.eventsSubBlock}>
              {getPostsByDate(posts, isToday).length > 0 && (
                <div className={styles.eventsSubBlockTitle}>
                  <span className={styles.buttonDay}>Today</span>
                </div>
              )}
              <PostsList
                posts={getPostsByDate(posts, isToday)}
                changeStar={changeStar}
                isViewForAllCategory={isViewForAllCategory}
              />
              {getPostsByDate(posts, isTomorrow).length > 0 && (
                <div className={styles.eventsSubBlockTitle}>
                  <span className={styles.buttonDay}>Tomorrow</span>
                </div>
              )}
              <PostsList
                posts={getPostsByDate(posts, isTomorrow)}
                changeStar={changeStar}
                isViewForAllCategory={isViewForAllCategory}
              />
              {getPostsByDate(
                posts,
                (date) => !isTomorrow(date) && !isToday(date)
              ).length > 0 && (
                <div className={styles.eventsSubBlockTitle}>
                  <span className={styles.buttonDay}>Soon</span>
                </div>
              )}
              <PostsList
                posts={getPostsByDate(
                  posts,
                  (date) => !isTomorrow(date) && !isToday(date)
                )}
                changeStar={changeStar}
                isViewForAllCategory={isViewForAllCategory}
              />
            </div>
          </div>
          <Pagination
            className={styles.pagination}
            current={current}
            onChange={changePageNumber}
            total={totalCount}
            defaultPageSize={postsPerPage}
            itemRender={(page, type, element) => {
              return (
                <>
                  {page === current ? (
                    <span
                      className="active"
                      style={{
                        display: "inline-block",
                        backgroundColor: "#921A64",
                        borderRadius: "50px",
                        width: "32px",
                        height: "32px",
                        color: "#ffffff",
                        fontSize: "14px",
                      }}
                    >
                      {element}
                    </span>
                  ) : (
                    <div>{element}</div>
                  )}
                </>
              );
            }}
          />
          <AddListing />
        </div>
      </div>
    </div>
  );
}
