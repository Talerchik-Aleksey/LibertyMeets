import styles from "./Textbox.module.scss";

export default function Textbox() {
  return (
    <section className={styles.container}>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>Что такое LibertyMeets</h4>
        <ul className={styles.textboxDescription}>
          <li>
            В отличие от сайтов социальных сетей, LibertyMeets ориентирован на
            личные встречи. связи для формирования местных связей и действий в
            вашем сообществе.
          </li>
          <li>
            Многие консерваторы/либертарианцы/модераторы всех возрастов хотели
            бы но не знают, как именно, помимо обращения к
            представителям/кампаниям, поиска в окольными путями, где/как стать
            волонтером, откликаться на призывы, размещения информации в
            социальных сетях и голосования.
          </li>
          <li>
            Они также хотели бы найти новых единомышленников, с которыми можно
            было бы общаться в социальном и профессиональном плане, особенно
            молодые взрослые, которые могут чувствовать себя изолированными в
            прогрессивных городах и организациях. Их пыл проявляется
            незаслуженно без более четкого и простого способа связаться лично с
            другими людьми, ориентированными на свободу.
          </li>
        </ul>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>
          Ваша конфиденциальность имеет первостепенное значение
        </h4>
        <ul className={styles.textboxDescription}>
          <li>
            Информация о регистрации служит для обеспечения связи пользователей
            с реальными людьми.
          </li>
          <li>
            В остальном, ваш бизнес - это не наш бизнес. Мы не и не будем
            делиться или продавать вашу информацию.
          </li>
          <li>
            Когда вы отвечаете на сообщение или кто-то отвечает на ваше
            сообщение, ваш адрес электронной почты будет анонимным. Не
            стесняйтесь ознакомиться с нашей политикой конфиденциальности для
            подробности.
          </li>
        </ul>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>Как это работает?</h4>
        <ul className={styles.textboxDescription}>
          <li>Простота и скорость - вот наши цели.</li>
          <li>Каждый может просматривать и отвечать на публичные сообщения.</li>
          <li>
            Зарегистрируйтесь, чтобы отправлять сообщения, просматривать личные
            сообщения и отвечать на них, а также отслеживать любимые сообщения.
          </li>
          <li>
            Здесь представлен короткий видеоролик, рассказывающий о
            функциональности сайта.
          </li>
        </ul>
      </div>
    </section>
  );
}
