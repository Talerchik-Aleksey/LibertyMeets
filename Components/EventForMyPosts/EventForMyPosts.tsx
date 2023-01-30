import { PostType } from "../../types/general";
import Image from "next/image";
import styles from "./EventForMyPosts.module.scss";
import Link from "next/link";

type EventForMyPostsProps = {
  post: PostType;
  movePost?: (postId: number) => void;
};

export default function EventForMyPosts({
  post,
  movePost,
}: EventForMyPostsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.leftBlock}>
        {post.is_favorite ? (
          <Image
            src="/decor/Icon.svg"
            alt=""
            width={20}
            height={20}
            className={styles.vector}
            onClick={() => movePost!(post.id)}
          />
        ) : (
          <></>
        )}
        <Link className={styles.link} href={`/events/${post.id}`}>
          <div className={styles.date}>Jul 4, 2023</div>
          <div className={styles.label}>{post.category}</div>
          <div className={styles.info}>{post.description}</div>
          <div className={styles.location}>{post.geo}</div>
        </Link>
      </div>
      {/* <div className={styles.location}>{post.geo}</div> */}
    </div>
  );
}
