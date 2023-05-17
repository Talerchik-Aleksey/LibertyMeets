import styles from "../Header.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function SearchOpportunities() {
  return (
    <li className={styles.navigationItem}>
      <Link className={styles.search} href={"/posts"}>
        <Image
          src="/decor/Vector4.svg"
          alt=""
          width={16}
          height={14}
          className={styles.vector}
        />
        <span className={styles.searchText}>Поиск объявлений</span>
      </Link>
    </li>
  );
}
