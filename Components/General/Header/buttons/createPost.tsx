import styles from "../Header.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function CreatePost() {
  return (
    <li className={styles.navigationItem}>
      <Link className={styles.createPosts} href={"/createPost"}>
        <Image
          src="/decor/Vector3.svg"
          alt=""
          width={16}
          height={14}
          className={styles.vector}
        />
        <span className={styles.createPostsText}>Создать объявление</span>
      </Link>
    </li>
  );
}
