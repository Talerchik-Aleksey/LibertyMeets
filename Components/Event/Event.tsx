import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { PostType } from "../../types/general";
import styles from "./Event.module.scss";

type EventSingleRowProps = {
  post: PostType;
  changeStar: (postId: number) => void;
  isViewForAllCategory: boolean;
};

export default function EventSingleRow(props: EventSingleRowProps) {
  const { post, changeStar, isViewForAllCategory } = props;
  const router = useRouter();
  const pathname = router.pathname.slice(1);

  return (
    <div className={styles.container}>
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
          <div className={styles.location}>
            {post.location_name
              ? `${post.location_name}`
              : `${post.city}, ${post.state}`}
          </div>
        </div>
      </Link>
    </div>
  );
}
