import LibertyMeetsLogo from "../../LibertyMeetsLogo";
import styles from "./HeaderSearchProfileCreateLogOut.module.scss";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function HeaderSearchProfileCreateLogOut() {
  return (
    <header className={styles.header}>
      <Link href={"/"}>
        <div className={styles.logo}>
          <LibertyMeetsLogo />
        </div>
      </Link>
      <menu className={styles.navigation}>
        <li className={styles.navigationItem}>
          <Link className={styles.navigationItemLink} href={""}>
            <Button className={styles.search}>
              <Image
                src="/decor/Vector4.svg"
                alt=""
                width={16}
                height={14}
                className={styles.vector}
              />
              <span className={styles.searchText}>Search Opportunities </span>
            </Button>
          </Link>
        </li>
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
        <li className={styles.navigationItem}>
          <Link className={styles.navigationItemLink} href={"/profile"}>
            <Button type="text" className={styles.myProfile}>
              My Profile
            </Button>
          </Link>
        </li>
        <li className={styles.navigationItem}>
          <Link className={styles.navigationItemLink} href={"/signin"}>
            <Button type="text" className={styles.logOut}>
              Log Out
            </Button>
          </Link>
        </li>
      </menu>
    </header>
  );
}
