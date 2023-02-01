import { Button } from "antd";
import Link from "next/link";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  return (
    <div className={styles.containerMenu}>
      <Link className={styles.event} href={"/my-favorites"}>
        <Button className={styles.button}>My Favorites</Button>
      </Link>
      <Link className={styles.event} href={"/myPosts"}>
        <Button className={styles.button}>My Posts</Button>
      </Link>
      <Link className={styles.event} href={"/settings"}>
        <Button className={styles.button}>Settings</Button>
      </Link>
    </div>
  );
}
