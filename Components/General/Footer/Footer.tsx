import Link from "next/link";
import { useRouter } from "next/router";
import LibertyMeetsLogo from "../../LibertyMeetsLogo";

import styles from "./Footer.module.scss";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <LibertyMeetsLogo />
      </div>
      <div className={styles.footerInfo}>
        <Link href="/about">
          <div className={styles.clickableText}>
            About LibertyMeets
          </div>
        </Link>
        <div className={styles.liberty}>LibertyMeets ©️ 2022</div>
      </div>
    </footer>
  );
}
