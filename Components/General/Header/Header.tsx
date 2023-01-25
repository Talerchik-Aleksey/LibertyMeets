import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Button } from "antd";
import { signOut } from "next-auth/react";
import LibertyMeetsLogo from "../../LibertyMeetsLogo";

const map = {
  showSearch: ["", "myFavoritesPosts", "myPosts", "settings", "about"],
  showCreatePost: [
    "",
    "posts",
    "myFavoritesPosts",
    "myPosts",
    "settings",
    "about",
  ],
  showMyProfile: [
    "",
    "posts",
    "myFavoritesPosts",
    "myPosts",
    "settings",
    "createPost",
    "about",
    "events",
  ],
  showLogOut: [
    "",
    "posts",
    "myFavoritesPosts",
    "myPosts",
    "settings",
    "createPost",
    "about",
    "events",
  ],
  showLogIn: ["", "registration", "about", "posts"],
  showSignUp: ["signin", "about", "posts"],
};

export default function Header() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const url = router.route.split("/")[1];

  useEffect(() => {
    if (session) {
      setIsLogin(true);
    }
  }, [session]);

  return (
    <>
      {isLogin ? (
        <header className={styles.header}>
          <div className={styles.logo}>
            <Link href={"/"}>
              <LibertyMeetsLogo />
            </Link>
          </div>
          <div className={styles.navigation}>
            <ul className={styles.navigationItemContainer}>
              {map.showSearch.includes(url) && (
                <li className={styles.navigationItem}>
                  <Link className={styles.navigationItemLink} href={"/posts"}>
                    <Button className={styles.search}>
                      <Image
                        src="/decor/Vector4.svg"
                        alt=""
                        width={16}
                        height={14}
                        className={styles.vector}
                      />
                      <span className={styles.searchText}>
                        Search Opportunities{" "}
                      </span>
                    </Button>
                  </Link>
                </li>
              )}
              {map.showCreatePost.includes(url) && (
                <li className={styles.navigationItem}>
                  <Link
                    className={styles.navigationItemLink}
                    href={"/createPost"}
                  >
                    <Button className={styles.createPosts}>
                      <Image
                        src="/decor/Vector3.svg"
                        alt=""
                        width={16}
                        height={14}
                        className={styles.vector}
                      />
                      <span className={styles.createPostsText}>
                        Create Post{" "}
                      </span>
                    </Button>
                  </Link>
                </li>
              )}
              {map.showMyProfile.includes(url) && (
                <li className={styles.navigationItem}>
                  {" "}
                  <Link
                    className={styles.navigationItemLink}
                    href={"/myFavoritesPosts"}
                  >
                    <Button type="text" className={styles.myProfile}>
                      My Profile
                    </Button>
                  </Link>
                </li>
              )}
              {map.showLogOut.includes(url) && (
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
              )}
            </ul>
          </div>
        </header>
      ) : (
        <header className={styles.header}>
          <div className={styles.logo}>
            <Link href={"/"}>
              <LibertyMeetsLogo />
            </Link>
          </div>
          <div className={styles.navigation}>
            <ul className={styles.navigationItemContainer}>
              {map.showSignUp.includes(url) && (
                <li className={styles.navigationItem}>
                  <Link
                    className={styles.navigationItemLink}
                    href={"/registration"}
                  >
                    <Button className={styles.signUp}>
                      <Image
                        src="/decor/Vector.svg"
                        alt=""
                        width={16}
                        height={14}
                        className={styles.vector}
                      />
                      <span className={styles.signUpText}>Sign Up </span>
                    </Button>
                  </Link>
                </li>
              )}
              {map.showLogIn.includes(url) && (
                <li className={styles.navigationItem}>
                  <Link className={styles.navigationItemLink} href={"/signin"}>
                    <Button type="text" className={styles.logIn}>
                      Log In
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </header>
      )}
    </>
  );
}
