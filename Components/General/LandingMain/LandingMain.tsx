import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./LandingMain.module.scss";
import RectangleRight from "../RectangleRight/RectangleRight";
import { Button } from "antd";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function LandingMain() {
  return (
    <section className={styles.container}>
      <h1 className={styles.unvisible}>LibertyMeets</h1>
      <div className={styles.titleBlock}>
        <div className={styles.rectangleLeftBlock}>
          <Image
            src="/decor/Rectangle 866.svg"
            alt=""
            width={284}
            height={258}
            className={styles.rectangleLeft}
          />
        </div>
        <div className={styles.logoInfo}>
          <div className={styles.infoBlock}>
            <Image
              src="/decor/Unframed.svg"
              alt="Liberty Meets"
              width={426}
              height={75}
              className={styles.logoImage}
            />
            <span className={styles.subtitle}>a New Job</span>
          </div>
          <h2 className={styles.description}>
            LibertyMeets is a classifieds website for finding freedom-friendly
            folks near you.
          </h2>
          <Link href={"/eventspage"}>
            <Button className={styles.infoBlockButtonPurple}>
              Search Public Opportunities
            </Button>
          </Link>
          <Link href={"/bycapcha"}>
            <Button className={styles.infoBlockButton}>
              Sign Up to Post, and to Search All Opportunities
            </Button>
          </Link>
        </div>
        <div className={styles.rectangleRight}>
          <RectangleRight />
        </div>
      </div>

      <div className={styles.valuesBlock}>
        <span className={styles.valuesTitle}> Our Values</span>
        <div className={styles.valuesContainer}>
          <div className={styles.valuesItem}>
            <Image
              src="/decor/liberty.svg"
              alt="Liberty"
              width={161}
              height={161}
            />
            <span className={styles.valuesText}>Liberty</span>
          </div>
          <div className={styles.valuesItem}>
            <Image
              src="/decor/community.svg"
              alt="Liberty"
              width={161}
              height={161}
            />
            <span className={styles.valuesText}>Community</span>
          </div>
          <div className={styles.valuesItem}>
            <Image
              src="/decor/privacy.svg"
              alt="Liberty"
              width={161}
              height={161}
            />
            <span className={styles.valuesText}>Privacy</span>
          </div>
        </div>
        <div className={styles.buttonBlock}>
          <Link className={styles.buttonLearnLink} href={"/about"}>
            <Button className={styles.buttonLearnMore}>
              Learn More About LibertyMeets
            </Button>
          </Link>
        </div>
      </div>
      <div className={styles.purpleBlock}>
        <Image
          src="/decor/Frame 36732.png"
          alt="Frame 36732"
          width={524}
          height={440}
          className={styles.libertyAbout}
        />
        <article className={styles.descriptionPurple}>
          <q>
            <span className={styles.quote}>
              LibertyMeets has helped us find new like-minded friends in our
              town. Finally a platform with people who have our values and is
              more than sitting behind a keyboard.
            </span>
          </q>
          <br />
          <br />
          <span className={styles.quote}>Bob & Jessica Smith</span>
        </article>
      </div>
    </section>
  );
}
