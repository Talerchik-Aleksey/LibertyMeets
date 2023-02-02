import { PostType } from "../../types/general";
import Image from "next/image";
import styles from "./EventForMyPosts.module.scss";
import Link from "next/link";
import moment from "moment";

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
      <div className={styles.star}>
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
      </div>
      <Link className={styles.link} href={`/posts/${post.id}`}>        
          <div className={styles.leftBlock}>
            <div className={styles.date}>
              {moment(post.created_at).format("MMM D, YYYY")}
            </div>
            <div className={styles.label}>{post.category}</div>
            <div className={styles.info}>{post.description}</div>
          </div>
          <div className={styles.rightBlock}>
            {!post.is_blocked && <div className={styles.blocked}><span className={styles.blockedText}>blocked</span> </div>}
            <div className={styles.location}>{post.geo}</div>
          </div>
      </Link>
    </div>
  );
}
