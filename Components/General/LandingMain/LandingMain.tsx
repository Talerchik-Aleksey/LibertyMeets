import Image from "next/image";
import styles from "./LandingMain.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";

const textMap = [
  "a New Job",
  "for Trivia Night",
  "to Take Action",
  "the Neighbors",
];

type LandingProps = {
  isAuthenticated: boolean;
};

export default function LandingMain(props: LandingProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      index != 3 ? setIndex(index + 1) : setIndex(0);
    }, 5000);
  }, [index]);

  return (
    <section className={styles.container}>
      <section className={styles.titleBlock}>
        <div className={styles.logoInfo}>
          <div className={styles.infoBlock}>
            <Image
              src="/decor/Unframed.svg"
              alt="Liberty Meets"
              width={426}
              height={75}
              className={styles.logoImage}
            />
            <span className={styles.subtitle}>{textMap[index]}</span>
          </div>
          <h2 className={styles.description}>
            LibertyMeets is a classifieds website for finding freedom-friendly
            folks near you.
          </h2>
          <Link className={styles.infoBlockButtonPurple} href="/posts">
            Search Public Opportunities
          </Link>
          {!props.isAuthenticated && (
            <Link className={styles.infoBlockButton} href="/registration">
              Sign Up to Post, and to Search All Opportunities
            </Link>
          )}
        </div>
      </section>
      <section className={styles.valuesBlock}>
        <span className={styles.valuesTitle}> Our Values</span>
        <div className={styles.valuesContainer}>
          <div className={styles.valuesItem}>
            <Image
              src="/decor/liberty.svg"
              alt="Liberty"
              width={161}
              height={161}
              className={styles.valuesItemImage}
            />
            <span className={styles.valuesText}>Liberty</span>
          </div>
          <div className={styles.valuesItem}>
            <Image
              src="/decor/community.svg"
              alt="Liberty"
              width={161}
              height={161}
              className={styles.valuesItemImage}
            />
            <span className={styles.valuesText}>Community</span>
          </div>
          <div className={styles.valuesItem}>
            <Image
              src="/decor/privacy.svg"
              alt="Liberty"
              width={161}
              height={161}
              className={styles.valuesItemImage}
            />
            <span className={styles.valuesText}>Privacy</span>
          </div>
        </div>
        <div className={styles.buttonBlock}>
          <Link className={styles.buttonLearnLink} href="/about">
            <span className={styles.buttonLearnMore}>
              Learn More About LibertyMeets
            </span>
          </Link>
        </div>
      </section>
      <section className={styles.purpleBlock}>
        <Image
          src="/decor/Frame-36732.png"
          alt="Frame-36732"
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
      </section>
    </section>
  );
}
