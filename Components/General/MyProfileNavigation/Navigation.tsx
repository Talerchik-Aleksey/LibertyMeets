import { Button } from "antd";
import Link from "next/link";
import styles from "./Navigation.module.scss";

type props = { activePage: string };

export default function Navigation(activePage: props) {
  return (
    <div className={styles.containerMenu}>
      <Link className={styles.event} href={"/my-favorites"}>
        <Button
          className={
            activePage.activePage === "My Favorites"
              ? styles.activeButton
              : styles.button
          }
        >
          My Favorites
        </Button>
      </Link>
      <Link className={styles.event} href={"/myPosts"}>
        <Button
          className={
            activePage.activePage === "My Posts"
              ? styles.activeButton
              : styles.button
          }
        >
          My Posts
        </Button>
      </Link>
      <Link className={styles.event} href={"/settings"}>
        <Button
          className={
            activePage.activePage === "Settings"
              ? styles.activeButton
              : styles.button
          }
        >
          Settings
        </Button>
      </Link>
    </div>
  );
}
