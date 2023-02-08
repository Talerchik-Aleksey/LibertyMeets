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

type PropsType = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: PostType[];
  initialCount: number;
};

export default function Events({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
}: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const [isViewForAllCategory, setIsViewForAllCategory] =
    useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialCount);
  }, [initialPosts, initialCount]);

  let page = 1;
  useEffect(() => {
    if (router.query?.page) {
      setCurrent(Number(router.query?.page));
    }
    if (router.query.category && typeof router.query.category === "string") {
      setCategory(router.query.category);
    }
  }, [router.query.category, router.query?.page]);

  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  function changePageNumber(page: number) {
    setCurrent(page);
    if (category) {
      router.push({
        pathname: `${appUrl}/posts`,
        query: { page, category },
      });

      return;
    }
    router.push({
      pathname: `${appUrl}/posts`,
      query: { page },
    });
  }

  async function changeCategory(category: string) {
    if (category === "All" || category === undefined) {
      setIsViewForAllCategory(true);
    } else {
      setIsViewForAllCategory(false);
    }
    if (category === "All") {
      setCategory(undefined);
      router.push({
        pathname: `${appUrl}/posts`,
        query: { page },
      });

      return;
    }
    setCategory(category.toLowerCase());
    setCurrent(1);
    router.push({
      pathname: `${appUrl}/posts`,
      query: { category: category.toLowerCase(), zip: zipCode },
    });
  }

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
    return posts.filter((post) => filterFn(new Date(post.created_at)));
  }

  async function searchByZipCode(zip: string) {
    if (zip === "") {
      setZipCode(undefined);
      router.push({
        pathname: `${appUrl}/posts`,
        query: { category, zip: zipCode },
      });

      return;
    }

    setZipCode(zip);
    router.push({
      pathname: `${appUrl}/posts`,
      query: category ? { category, zip } : { zip },
    });
  }

  return (
    <section className={styles.eventsPageContainer}>
      <div className={styles.navigation}>
        <NavBar
          changeCategory={changeCategory}
          searchByZipCode={searchByZipCode}
        />
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
                  <span className={styles.buttonDay}>Earlier</span>
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
          {postsPerPage >= totalCount ? (
            <></>
          ) : (
            <Pagination
              className={styles.pagination}
              current={current}
              onChange={changePageNumber}
              total={totalCount}
              defaultPageSize={postsPerPage}
              showLessItems={true}
              responsive={true}
              itemRender={(page, type, element) => {
                return (
                  <>
                    {page === current ? (
                      <span
                        className="active"
                        style={{
                          display: "inline-block",
                          backgroundColor: "#921A64",
                          borderRadius: "50%",
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
          )}
          <AddListing />
        </div>
      </div>
    </section>
  );
}
