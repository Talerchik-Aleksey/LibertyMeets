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
              {buttonMap.showSearch.includes(url) && <SearchOpportunities />}
              {buttonMap.showCreatePost.includes(url) && <CreatePost />}
              {buttonMap.showMyProfile.includes(url) && <MyProfile />}
              {buttonMap.showLogOut.includes(url) && <LogOut />}
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
              {buttonMap.showSignUp.includes(url) && <SignUp />}
              {buttonMap.showLogIn.includes(url) && <LogIn />}
            </ul>
          </div>
        </header>
      )}
    </>
  );
}
