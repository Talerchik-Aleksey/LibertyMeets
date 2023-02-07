import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { PostType } from "../../types/general";
import Location from "../Location/Location";
import styles from "./Event.module.scss";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

type EventSingleRowProps = {
  post: PostType;
  changeStar: (postId: number) => void;
  isViewForAllCategory: boolean;
};

export default function EventSingleRow(props: EventSingleRowProps) {
  const { post, changeStar, isViewForAllCategory } = props;
  const router = useRouter();
  const pathname = router.pathname.slice(1);
  const [isLogin, setIsLogin] = useState<Boolean>(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      session?.user && setIsLogin(true);
    })();
  });

  return (
    <div className={styles.container}>
      {isLogin && (
        <div className={styles.star}>
          {post.favoriteUsers?.length > 0 || post.is_favorite ? (
            <div
              onClick={() => {
                changeStar(post.id);
              }}
            >
              <Image
                src="/decor/starFaiv.svg"
                alt=""
                width={20}
                height={20}
                className={styles.vector}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                changeStar(post.id);
              }}
            >
              <Image
                src="/decor/starNoFaiv.svg"
                alt=""
                width={20}
                height={20}
                className={styles.vector}
              />
            </div>
          )}
        </div>
      )}

      <Link
        className={styles.link}
        href={`/posts/${post.id}/?fromUrl=${pathname}`}
      >
        <div className={styles.leftBlock}>
          {isViewForAllCategory ? (
            <div className={styles.label}>{post.category}</div>
          ) : (
            <></>
          )}
          <div className={styles.info}>{post.title}</div>
        </div>
        <div className={styles.rightBlock}>
          <Location post={post} />
        </div>
      </Link>
    </div>
  );
}
