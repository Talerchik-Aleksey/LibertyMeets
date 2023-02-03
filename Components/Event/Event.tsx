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
      <div className={styles.star}>
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
      </div>

      <Link className={styles.link} href={`/posts/${post.id}`}>
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
          {/* (Fairfax, VA) */}
          {post.geo}
        </div>
      </div>  
        </Link>
    </div>
  );
}
