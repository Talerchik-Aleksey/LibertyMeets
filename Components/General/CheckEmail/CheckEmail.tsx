import styles from "./CheckEmail.module.scss";

export default function CheckEmail() {
  return (
    <section className={styles.container}>
      <h5 className={styles.message}>
        Thank you, please check your email and follow the instructions.
      </h5>
    </section>
  );
}
