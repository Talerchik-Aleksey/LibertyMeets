import styles from "../Header.module.scss";
import { Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LogIn() {
  const router = useRouter();

  return (
    <li className={styles.navigationItem}>
      {" "}
      <Link className={styles.navigationItemLink} href={"/signin"}>
        <Button type="text" className={styles.logIn}>
          Log In
        </Button>
      </Link>
    </li>
  );
}
