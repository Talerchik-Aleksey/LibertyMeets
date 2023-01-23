import Image from "next/image";
import styles from "./RectangleRight.module.scss";

export default function RectangleRight() {
  return (
    <div className={styles.rectangleRight}>
      <Image
        src="/decor/Rectangle 865.svg"
        alt=""
        width={212}
        height={280}
        className={styles.right}
      />{" "}
    </div>
  );
}
