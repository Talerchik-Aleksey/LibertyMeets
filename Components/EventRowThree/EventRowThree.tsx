import { StarFilled, StarOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import styles from "./EventRowThree.module.scss";

export default function EventRowThree() {
  const [isLike, setIsLike] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftBlock}>
        <div
          onClick={() => {
            setIsLike(true);
          }}
          className={styles.likeBlock}
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
        </div>

        <div className={styles.info}>
          Please check out our policy platform at SmithForSenator.com. We
          appreciate your support helping to break the GOP monopoly! Please
          check out our policy platform at SmithForSenator.com. We appreciate
          your support helping to break the GOP monopoly! Please check out our
          policy platform at SmithForSenator.com. We appreciate your support
          helping to break the GOP monopoly! Please check out our policy
          platform at SmithForSenator.com. We appreciate your support helping to
          break the GOP monopoly!
        </div>
      </div>
      <div className={styles.location}>(Fairfax, VA)</div>
    </div>
  );
}
