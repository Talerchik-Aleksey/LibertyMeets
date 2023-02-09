import { useState, useEffect } from "react";
import AddListing from "../AddListing/AddListing";
import NavBar from "../General/NavBar/NavBar";
import { isToday, isTomorrow } from "../../utils/eventTimeStatus";
import styles from "./Events.module.scss";
import { useRouter } from "next/router";
import { PostType } from "../../types/general";
import PostsList from "../PostsList";
import axios from "axios";
import { PaginationForPosts } from "../General/Pagination/Pagination";
import { useSession } from "next-auth/react";

type PropsType = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: PostType[];
  initialCount: number;
};

type queryType = {
  page?: number;
  category?: string;
  zip?: string;
  radius?: string;
  lat?: number;
  lng?: number;
};

export default function Events({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
}: PropsType) {
  const session = useSession();
  const [current, setCurrent] = useState<number>(1);
  const [isViewForAllCategory, setIsViewForAllCategory] =
    useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [radius, setRadius] = useState<string | undefined>(undefined);
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
    const query: queryType = { page };

    if (category) {
      query.category = category;
    }
    if (zipCode) {
      query.zip = zipCode;
    }
    if (radius) {
      query.radius = radius;
    }

    router.push({
      pathname: `${appUrl}/posts`,
      query: query,
    });
  }

  async function changeCategory(category: string) {
    if (category === "All" || category === undefined) {
      setIsViewForAllCategory(true);
    } else {
      setIsViewForAllCategory(false);
    }
    if (category === "All") {
      const query: queryType = { page };
      if (zipCode) {
        query.zip = zipCode;
      }

      setCategory(undefined);
      router.push({
        pathname: `${appUrl}/posts`,
        query: query,
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
    if (!zip || zip === "") {
      setZipCode(undefined);
      router.push({
        pathname: `${appUrl}/posts`,
        query: { category },
      });

      return;
    }

    setZipCode(zip);
    router.push({
      pathname: `${appUrl}/posts`,
      query: category ? { category, zip } : { zip },
    });
  }

  async function searchByRadius(radius: string) {
    if (!radius || radius === "") {
      setRadius(undefined);
      // TODO: Add push into another categories
      return;
    }

    const lat = session.data?.user.lat;
    const lng = session.data?.user.lng;
    if (lat === undefined || lng === undefined) {
      alert("Login in account and give access to your location");

      return;
    }

    setRadius(radius);
    const dataForQuery: queryType = { radius };
    dataForQuery.lat = lat;
    dataForQuery.lng = lng;
    console.log(dataForQuery);
    router.push({
      pathname: `${appUrl}/posts`,
      query: dataForQuery,
    });
  }

  return (
    <section className={styles.eventsPageContainer}>
      <div className={styles.navigation}>
        <NavBar
          changeCategory={changeCategory}
          searchByZipCode={searchByZipCode}
          searchByRadius={searchByRadius}
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
          <PaginationForPosts
            category={category}
            totalCount={totalCount}
            appUrl={appUrl}
            postsPerPage={postsPerPage}
            changePage={changePageNumber}
          />
          <AddListing />
        </div>
      </div>
    </section>
  );
}
