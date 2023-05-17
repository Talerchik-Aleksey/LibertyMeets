import styles from "./CheckEmail.module.scss";

export default function CheckEmail() {
  return (
    <section className={styles.container}>
      <h5 className={styles.message}>
        Ваш запрос на сброс пароля успешно отправлен! Пожалуйста, проверьте свою
        электронную почту для получения дальнейших инструкций по сбросу пароля.
        Если вы не получите письмо в течение следующего часа, проверьте папку
        "Спам" или обратитесь в службу поддержки. папку со спамом или обратитесь
        за помощью в службу поддержки.
      </h5>
    </section>
  );
}
