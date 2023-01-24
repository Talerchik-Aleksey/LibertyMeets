import { Pagination } from "antd";
import { useState, useEffect } from "react";
import AddListing from "../AddListing/AddListing";
import EventRowThree from "../EventRowThree/EventRowThree";
import EventSingleRow from "../EventSingleRow/EventSingleRow";
import NavBar from "../General/NavBar/NavBar";
import { isToday, isTomorrow } from "../../utils/eventTimeStatus";
import styles from "./Events.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { PostType } from "../../types/general";
import PostsList from "../PostsList";
import axios from "axios";

type PropsType = { appUrl: string };

export default function Events({ appUrl }: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
  };

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
    console.log("page <-------", page);
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
              {/* <Link className={styles.event} href={"/liveposts"}>
                <EventSingleRow />
              </Link> */}
              <PostsList
                posts={getPostsByDate(posts, isToday)}
                appUrl={appUrl}
                changeStar={changeStar}
              />
            </div>
            {/* <div className={styles.eventsSubBlock}>
              {getPostsByDate(posts, isTomorrow).length > 0 && (
                <div className={styles.eventsSubBlockTitle}>
                  <span className={styles.buttonDay}>Tomorrow</span>
                </div>
              )}
              <Link className={styles.event} href={"/liveposts"}>
                <EventSingleRow />
              </Link>
              <PostsList
                posts={getPostsByDate(posts, isTomorrow)}
                appUrl={appUrl}
                changeStar={changeStar}
              />
            </div> */}
            {/* <div className={styles.eventsSubBlock}>
              {getPostsByDate(
                posts,
                (date) => !isTomorrow(date) && !isToday(date)
              ).length > 0 && (
                <div className={styles.eventsSubBlockTitle}>
                  <span className={styles.buttonDay}>Soon</span>
                </div>
              )}
              <Link className={styles.event} href={"/liveposts"}>
                <EventSingleRow />
              </Link>
              <PostsList
                posts={getPostsByDate(
                  posts,
                  (date) => !isTomorrow(date) && !isToday(date)
                )}
                appUrl={appUrl}
                changeStar={changeStar}
              />
            </div> */}
            {/* <div className={styles.eventsSubBlock}>
              <div className={styles.eventsSubBlockTitle}>
                {" "}
                <span className={styles.buttonDay}>Yesterday</span>
              </div>
              <Link className={styles.event} href={"/liveposts"}>
                <EventRowThree />
              </Link>
              <Link className={styles.event} href={"/liveposts"}>
                <EventRowThree />
              </Link>
              <Link className={styles.event} href={"/liveposts"}>
                <EventRowThree />
              </Link>
              <Link className={styles.event} href={"/liveposts"}>
                <EventRowThree />
              </Link>
              <Link className={styles.event} href={"/liveposts"}>
                <EventRowThree />
              </Link>
              <Link className={styles.event} href={"/liveposts"}>
                <EventRowThree />
              </Link>
            </div> */}
          </div>
          <Pagination
            className={styles.pagination}
            current={current}
            onChange={changePageNumber}
            total={totalCount}
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
