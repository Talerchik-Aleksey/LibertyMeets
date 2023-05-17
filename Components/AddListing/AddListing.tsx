import styles from "./AddListing.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AddListing() {
  const session = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.noCriteria}>
        Нет других возможностей, отвечающих этим критериям
      </div>
      <div className={styles.title}>Добавить свое объявление</div>
      <Link
        className={styles.createPost}
        href={session.status === "authenticated" ? "/createPost" : "/signin"}
      >
        <Image
          src="/decor/Vector3.svg"
          alt=""
          width={16}
          height={14}
          className={styles.vector}
        />
        <span className={styles.buttonText}>Создать объявление</span>
      </Link>
    </div>
  );
}
