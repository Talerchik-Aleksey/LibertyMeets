import styles from "./ExpiredTokenPage.module.scss";

export default function ExpiredTokenPage() {
  return (
    <section className={styles.container}>
      <h5 className={styles.codeMessage}>401</h5>
      <span className={styles.message}>Authorization Required</span>
    </section>
  );
}
