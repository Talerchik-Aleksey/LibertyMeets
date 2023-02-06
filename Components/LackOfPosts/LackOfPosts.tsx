import { Button } from "antd";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import styles from "./LackOfPosts.module.scss";
import Image from "next/image";
import CreatePost from "../General/Header/buttons/createPost";
import SearchOpportunities from "../General/Header/buttons/searchOpportunities";

const buttonMap = {
  showFaivorites: ["my-favorites", ""],
  showMyPosts: ["myPosts", ""]
};

export default function LackOfPosts() {
  const router: NextRouter = useRouter();
  const url: Array<string> = router.route.split("/");
  const page: string = url.slice(1, url.length).join("/");
  return (
    <div>
      {buttonMap.showFaivorites.indexOf(page) !== -1 && <div>
        <div className={styles.container}>
          <div className={styles.noCriteria}>
            Your favorite posts will be displayed here, find some and add them now!
          </div>
          <div className={styles.title}>Go to</div>

          <SearchOpportunities />
        </div>
      </div>}
      {buttonMap.showMyPosts.indexOf(page) !== -1 && <div
        className={styles.container}>
        <div className={styles.noCriteria}>
          You do not have any posts that you are the author of.
        </div>
        <div className={styles.title}>you can create it right now</div>
        <CreatePost />
      </div>}
    </div>
  );
}
