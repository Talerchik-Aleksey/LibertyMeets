import { StarFilled, StarOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { PostType } from "../../types/general";
import styles from "./EventSingleRow.module.scss";

type EventSingleRowProps = {
  post: PostType;
  appUrl: string;
  changeStar: (postId: number) => void;
};

export default function EventSingleRow(props: EventSingleRowProps) {
  const { post, appUrl, changeStar } = props;
  const router = useRouter();

  const goToPostPage = (post_id: number) => {
    router.push(`${appUrl}/events/${post_id}`);
  };
  const [isLike, setIsLike] = useState<boolean>(false);

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
        {/* <div
          onClick={() => {
            setIsLike(true);
          }}
        >
          {isLike ? (
            <Image
              src="/decor/Icon.svg"
              alt=""
              width={20}
              height={20}
              className={styles.vector}
            />
          ) : (
            <Image
              src="/decor/Icon2.svg"
              alt=""
              width={20}
              height={20}
              className={styles.vector}
            />
          )}
        </div> */}
        <div className={styles.label}>Social</div>
        <div className={styles.info}>
          {post.description}
          {/* Please check out our policy platform at SmithForSenator.com. We
          appreciate your support helping to break the GOP monopoly! Please
          check out our policy platform at SmithForSenator.com. We appreciate
          your support helping to break the GOP monopoly! Please check out our
          policy platform at SmithForSenator.com. We appreciate your support
          helping to break the GOP monopoly! Please check out our policy
          platform at SmithForSenator.com. We appreciate your support helping to
          break the GOP monopoly! */}
        </div>
      </div>
      <div className={styles.location}>{/* (Fairfax, VA) */}{post.geo}</div>
    </div>
  );
}
