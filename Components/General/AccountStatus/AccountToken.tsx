import styles from "./AccountToken.module.scss";

const informationInPage = {
  success: {
    message:
      "Ваша учетная запись успешно активирована. Теперь вы можете пользоваться всеми возможностями нашего сервиса. Если у вас возникнут вопросы, не стесняйтесь обращаться к нам. Приятного пользования!",
  },
  error: {
    message:
      "Извините, произошла ошибка. Пожалуйста, повторите попытку позже или обратитесь в службу поддержки за помощью.",
  },
};

export default function AccountToken({ isError }: { isError: boolean }) {
  return (
    <section className={styles.container}>
      <h5 className={styles.codeMessage}>
        {isError ? "Ошибка" : "Поздравляем!"}
      </h5>
      <span className={styles.message}>
        {isError
          ? informationInPage.error.message
          : informationInPage.success.message}
      </span>
    </section>
  );
}
