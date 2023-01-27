import styles from "../Header.module.scss";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";

export default function SearchOpportunities() {
  return (
    <li className={styles.navigationItem}>
      <Link className={styles.navigationItemLink} href={"/posts"}>
        <Button className={styles.search}>
          <Image
            src="/decor/Vector4.svg"
            alt=""
            width={16}
            height={14}
            className={styles.vector}
          />
          <span className={styles.searchText}>Search Opportunities </span>
        </Button>
      </Link>
    </li>
  );
}
