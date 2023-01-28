import styles from "../Header.module.scss";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";

export default function CreatePost() {
  return (
    <li className={styles.navigationItem}>
      <Link className={styles.navigationItemLink} href={"/createPost"}>
        <Button className={styles.createPosts}>
          <Image
            src="/decor/Vector3.svg"
            alt=""
            width={16}
            height={14}
            className={styles.vector}
          />
          <span className={styles.createPostsText}>Create Post </span>
        </Button>
      </Link>
    </li>
  );
}
