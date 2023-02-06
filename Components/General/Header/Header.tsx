import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.scss";
import LibertyMeetsLogo from "../../LibertyMeetsLogo";
import LogOut from "./buttons/logOut";
import MyProfile from "./buttons/myProfile";
import CreatePost from "./buttons/createPost";
import SearchOpportunities from "./buttons/searchOpportunities";
import LogIn from "./buttons/logIn";
import SignUp from "./buttons/signUp";
import Image from "next/image";

const buttonMap = {
  showSearch: ["", "my-favorites", "myPosts", "settings", "about"],
  showCreatePost: ["", "posts", "my-favorites", "myPosts", "settings", "about"],
  showMyProfile: [
    "",
    "posts",
    "my-favorites",
    "myPosts",
    "settings",
    "createPost",
    "about",
    "posts/[postId]",
    "posts/edit/[postId]",
  ],
  showLogOut: [
    "",
    "posts",
    "my-favorites",
    "myPosts",
    "settings",
    "createPost",
    "about",
    "posts/[postId]",
    "posts/edit/[postId]",
  ],
  showLogIn: [
    "",
    "registration",
    "about",
    "posts",
    "reset-password",
    "posts/[postId]",
  ],
  showSignUp: ["signin", "about", "posts", "reset-password", "posts/[postId]"],
};

export default function Header() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  // const [unvisible, setUnvisible] = useState<boolean>(true);
  const router: NextRouter = useRouter();
  const url: Array<string> = router.route.split("/");
  const page: string = url.slice(1, url.length).join("/");

  useEffect(() => {
    if (session) {
      setIsLogin(true);
    }
  }, [session]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href={"/"}>
            <LibertyMeetsLogo />
          </Link>
          <div
            className={styles.burgerButton}
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <Image src="/decor/close.svg" alt="" width={60} height={60} />
            ) : (
              <Image src="/decor/menu.svg" alt="" width={60} height={60} />
            )}
          </div>
        </div>

        <div className={visible ? styles.visible : styles.navigation}>
          {isLogin ? (
            <ul className={styles.navigationItemContainer}>
              {buttonMap.showSearch.indexOf(page) !== -1 && (
                <SearchOpportunities />
              )}
              {buttonMap.showCreatePost.indexOf(page) !== -1 && <CreatePost />}
              {buttonMap.showMyProfile.indexOf(page) !== -1 && <MyProfile />}
              {buttonMap.showLogOut.indexOf(page) !== -1 && <LogOut />}
            </ul>
          ) : (
            <ul className={styles.navigationItemContainer}>
              {buttonMap.showSignUp.indexOf(page) !== -1 && <SignUp />}
              {buttonMap.showLogIn.indexOf(page) !== -1 && <LogIn />}
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
