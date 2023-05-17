import Image from "next/image";
import styles from "./LandingMain.module.scss";
import Link from "next/link";
import SearchOpportunities from "../Header/buttons/searchOpportunities";
import SignUp from "../Header/buttons/signUp";
import AboutBlocks from "./AboutBlocks";

export default function LandingMain() {
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
          </div>
          <h2 className={styles.description}>
            Место, где можно найти дружественных к свободе людей поблизости от
            вас.
          </h2>
        </div>
      </section>
      <section className={styles.valuesBlock}>
        <div className={styles.valuesContainer}>
          <AboutBlocks />
        </div>
        <div className={styles.buttonBlock}>
          <Link className={styles.buttonLearnLink} href="/about">
            <span className={styles.buttonLearnMore}>
              Узнайте больше о LibertyMeets
            </span>
          </Link>
        </div>
      </section>
      <section className={styles.purpleBlock}>
        <article className={styles.descriptionPurple}>
          <q>
            <span className={styles.quote}>
              LibertyMeets помог нам найти новых друзей-единомышленников в нашем
              городе. Наконец-то появилась платформа с людьми, которые разделяют
              наши ценности и являются больше, чем просто сидящие за
              клавиатурой.
            </span>
          </q>
          <br />
          <br />
          <span className={styles.quote}>Боб и Джессика Смит</span>
          <div className={styles.controlButtons}>
            <SearchOpportunities />
            <SignUp />
          </div>
        </article>
      </section>
    </section>
  );
}
