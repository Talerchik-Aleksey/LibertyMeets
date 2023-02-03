import { Button, Pagination } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { PostType } from "../../types/general";
import EventForMyPosts from "../EventForMyPosts/EventForMyPosts";
import Navigation from "../General/MyProfileNavigation/Navigation";
import styles from "./MyPosts.module.scss";
import LackOfPosts from "../LackOfPosts/LackOfPosts";

type MyPostsProps = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: PostType[];
  initialCount: number;
  postsIsFavorites?: boolean;
};

export default function MyPosts({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
  postsIsFavorites,
}: MyPostsProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [current, setCurrent] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialCount);
  }, [initialPosts, initialCount]);

  useEffect(() => {
    if (router.query?.page) {
      setCurrent(Number(router.query?.page));
    }
  }, [router.query?.page]);

  function changePageNumber(page: number) {
    setCurrent(page);
    if (postsIsFavorites) {
      router.push({
        pathname: `${appUrl}/my-favorites`,
        query: { page },
      });
      return;
    }
    router.push({
      pathname: `${appUrl}/myPosts`,
      query: { page },
    });
  }

  async function movePost(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);
    if (res.status === 200) {
      router.push({
        pathname: `${appUrl}/my-favorites`,
        query: { page: 1 },
      });
    }
  }

  return (
    <section className={styles.profileWrapper}>
      <Navigation />
      {posts.length === 0 ? (
        // eslint-disable-next-line react/no-unescaped-entities
        <LackOfPosts />
      ) : (
        <section className={styles.profileContainer}>
          <div className={styles.container}>
            {posts.map((item) => (
              <EventForMyPosts key={item.id} post={item} movePost={movePost} />
            ))}
          </div>
          <Pagination
            className={styles.pagination}
            current={current}
            onChange={changePageNumber}
            total={totalCount}
            showLessItems={true}
            responsive={true}
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
        </section>
      )}
    </section>
  );
}
