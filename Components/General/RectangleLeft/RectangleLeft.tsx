import Image from "next/image";
import styles from "./RectangleLeft.module.scss";

export default function RectangleLeft() {
  return (
    <div className={styles.rectangleLeft}>
      <Image
        src="/decor/Rectangle 864.svg"
        alt=""
        width={469}
        height={258}
        className={styles.left}
      />
    </div>
  );
}
