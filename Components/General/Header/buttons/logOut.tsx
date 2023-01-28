import styles from "../Header.module.scss";
import { Button } from "antd";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function LogOut() {
  return (
    <li className={styles.navigationItem}>
      {" "}
      <Link className={styles.navigationItemLink} href={"/signin"}>
        <Button type="text" className={styles.logOut} onClick={() => signOut()}>
          Log Out
        </Button>
      </Link>
    </li>
  );
}
