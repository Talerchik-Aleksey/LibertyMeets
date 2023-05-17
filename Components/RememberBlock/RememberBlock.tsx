import styles from "./RememberBlock.module.scss";
import Image from "next/image";

export default function RememberBlock() {
  return (
    <section className={styles.rememberWrapper}>
      <Image
        src="/decor/remember.svg"
        alt=""
        width={45}
        height={41}
        className={styles.rememberImage}
      />
      <span className={styles.title}>Запомни!</span>
      <p className={styles.description}>
        Пожалуйста, не указывайте детали времени/местоположения или личную
        идентифицирующую информацию в названии или описании сообщения. И если вы
        встречаетесь с незнакомыми людьми, пожалуйста, делайте это в
        общественном месте.
      </p>
    </section>
  );
}
