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
import { message } from "antd";
import getLocation from "../../services/geocodeSearch";

type PropsType = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: PostType[];
  initialCount: number;
  isLogin: boolean;
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
  isLogin,
}: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const [isViewForAllCategory, setIsViewForAllCategory] =
    useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [radius, setRadius] = useState<string | undefined>(undefined);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const error = (text: string) => {
    messageApi.destroy();
    messageApi.open({
      type: "error",
      content: text,
      duration: 10,
      style: {
        marginTop: "15vh",
      },
    });
  };

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

  async function fillQueryParams(query: queryType) {
    if (category) {
      query.category = category;
    }
    /*if (zipCode) {
      query.zip = zipCode;
    }*/
    if (radius) {
      query.radius = radius;
    }
    if (lat !== undefined && lng !== undefined) {
      query.lat = lat;
      query.lng = lng;
    }
  }

  function changePageNumber(page: number) {
    setCurrent(page);
    const query: queryType = { page };
    fillQueryParams(query);
    router.push({
      pathname: `${appUrl}/posts`,
      query: query,
    });
  }

  async function changeCategory(category: string) {
    const query: queryType = {};
    await fillQueryParams(query);

    if (category === "All" || category === undefined) {
      setIsViewForAllCategory(true);
    } else {
      setIsViewForAllCategory(false);
    }
    if (category === "All") {
      setCategory(undefined);
      query.category = undefined;
      router.push({
        pathname: `${appUrl}/posts`,
        query: query,
      });

      return;
    }
    setCategory(category);
    setCurrent(1);
    query.category = category.toLowerCase();
    router.push({
      pathname: `${appUrl}/posts`,
      query: query,
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
      return;
    }

    setZipCode(zip);

    if (radius) {
      await searchByRadius(radius);
    }
  }

  async function searchByRadius(radius: string) {
    const dataForQuery: queryType = {};

    if (lat === undefined || lng === undefined) {
      error("Login in account and give access to your location");
      return;
    }

    if (!radius || radius === "") {
      setRadius(undefined);
      await fillQueryParams(dataForQuery);
      dataForQuery.radius = undefined;
      router.push({
        pathname: `${appUrl}/posts`,
        query: dataForQuery,
      });
    }

    setRadius(radius);

    await fillQueryParams(dataForQuery);
    dataForQuery.radius = radius;
    if (zipCode) {
      const locations = await getLocation(zipCode);
      if (locations?.locations[0]) {
        dataForQuery.lat = locations.locations[0].geometry.location.lat;
        dataForQuery.lng = locations.locations[0].geometry.location.lng;
      }
    }
    router.push({
      pathname: `${appUrl}/posts`,
      query: dataForQuery,
    });
  }

  return (
    <section className={styles.eventsPageContainer}>
      <div className={styles.error}>{contextHolder}</div>
      <div className={styles.navigation}>
        <NavBar
          zip={zipCode}
          appUrl={appUrl}
          setLat={setLat}
          setLng={setLng}
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
                isLogin={isLogin}
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
                isLogin={isLogin}
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
                isLogin={isLogin}
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
