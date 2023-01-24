import LibertyMeetsLogo from "../../LibertyMeetsLogo";
import styles from "./GuestHeader.module.scss";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function GuestHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href={"/"}>
          <LibertyMeetsLogo />
        </Link>
      </div>
      <div className={styles.navigation}>
        <Link className={styles.itemLink} href={"/registration"}>
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
        <Link className={styles.itemLink} href={"/signin"}>
          <Button type="text" className={styles.logIn}>
            Log In
          </Button>
        </Link>
      </div>
    </header>
  );
}
