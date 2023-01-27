import styles from "../Header.module.scss";
import { Button } from "antd";
import { useRouter } from "next/router";

export default function LogIn() {
  const router = useRouter();

  return (
    <li className={styles.navigationItem}>
      <Button
        type="text"
        className={styles.logIn}
        onClick={() => {
          router.push({
            pathname: "/signin",
            query: { callbackUrl: router.asPath },
          });
        }}
      >
        Log In
      </Button>
    </li>
  );
}
