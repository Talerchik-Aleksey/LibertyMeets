import { Button } from "antd";
import Link from "next/link";
import styles from "./Navigation.module.scss";

type NavigationProps = { activePage: string };

export default function Navigation(activePage: NavigationProps) {
  const NavigationMap = ["Мои избранные", "Мои объявления", "Мои настройки"];
  const links: Record<string, string> = {
    "Мои избранные": "/my-favorites",
    "Мои настройки": "/settings",
    "Мои объявления": "/myPosts",
  };

  return (
    <div className={styles.containerMenu}>
      {NavigationMap.map((item) => (
        <Link
          className={styles.navigationItem}
          href={`${links[item as keyof Object]}`}
          key={item}
        >
          <Button
            className={
              activePage.activePage === item
                ? styles.activeButton
                : styles.button
            }
          >
            {item}
          </Button>
        </Link>
      ))}
    </div>
  );
}
