import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  const [visible, setVisible] = useState<boolean>(false);
  const [unvisible, setUnvisible] = useState<boolean>(true);
  const router = useRouter();
  const url = router.route.split("/")[1];

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
            onClick={() => setVisible(!visible)}>
            {visible ?
              <Image 
                src="/decor/close.svg" 
                alt=""
                width={60} 
                height={60} /> :
              <Image
                src="/decor/menu.svg"
                alt=""
                width={60}
                height={60} />}
          </div>
        </div>

        <div className={visible ? styles.visible : styles.navigation}>
          {isLogin ? (
            <ul className={styles.navigationItemContainer}>
              {buttonMap.showSearch.includes(url) && <SearchOpportunities />}
              {buttonMap.showCreatePost.includes(url) && <CreatePost />}
              {buttonMap.showMyProfile.includes(url) && <MyProfile />}
              {buttonMap.showLogOut.includes(url) && <LogOut />}
            </ul>
          ) : (
            <ul className={styles.navigationItemContainer}>
              {buttonMap.showSignUp.includes(url) && <SignUp />}
              {buttonMap.showLogIn.includes(url) && <LogIn />}
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
