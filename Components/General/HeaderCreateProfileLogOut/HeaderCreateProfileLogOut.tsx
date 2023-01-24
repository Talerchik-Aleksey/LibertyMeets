import LibertyMeetsLogo from "../../LibertyMeetsLogo";
import styles from "./HeaderCreateProfileLogOut.module.scss";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function HeaderCreateProfileLogOut() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href={"/"}>
          <LibertyMeetsLogo />
        </Link>
      </div>
      <div className={styles.navigation}>
        <ul className={styles.navigationItemContainer}>
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
            {" "}
            <Link className={styles.navigationItemLink} href={"/profile"}>
              <Button type="text" className={styles.myProfile}>
                My Profile
              </Button>
            </Link>
          </li>
          <li className={styles.navigationItem}>
            {" "}
            <Link className={styles.navigationItemLink} href={"/signin"}>
              <Button
                type="text"
                className={styles.logOut}
                onClick={() => signOut()}
              >
                Log Out
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
