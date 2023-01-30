import Image from "next/image";
import Link from "next/link";
import { PostType } from "../../types/general";
import styles from "./Event.module.scss";

type EventSingleRowProps = {
  post: PostType;
  changeStar: (postId: number) => void;
  isViewForAllCategory: boolean;
};

export default function EventSingleRow(props: EventSingleRowProps) {
  const { post, changeStar, isViewForAllCategory } = props;

  return (
    <div className={styles.container}>
      <div className={styles.leftBlock}>
        {post.favoriteUsers?.length > 0 || post.is_favorite ? (
          <div
            onClick={() => {
              changeStar(post.id);
            }}
          >
            <Image
              src="/decor/Icon.svg"
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
              src="/decor/Icon2.svg"
              alt=""
              width={20}
              height={20}
              className={styles.vector}
            />
          </div>
        )}
        <Link className={styles.link} href={`/posts/${post.id}`}>
          {isViewForAllCategory ? (
            <div className={styles.label}>{post.category}</div>
          ) : (
            <></>
          )}
          <div className={styles.info}>{post.description}</div>
        </Link>
      </div>
      <div className={styles.location}>
        {/* (Fairfax, VA) */}
        {post.geo}
      </div>
    </div>
  );
}
