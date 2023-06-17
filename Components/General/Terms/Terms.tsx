import styles from "./Terms.module.scss";

export default function Terms() {
  return (
    <section className={styles.container}>
      <div className={styles.terms}>
        <h4 className={styles.termsTitle}>Наша политика конфиденциальности</h4>
        <p className={styles.termsDescriptionBold}>
          Настоящая Политика конфиденциальности описывает нашу политику и
          процедуры в отношении сбора, использования и раскрытия Вашей
          информации, когда Вы используете Услуги, а также рассказывает о Ваших
          правах на конфиденциальность и о том, как закон защищает Вас. Мы
          используем Ваши личные данные для предоставления и улучшения Услуги.
          Используя Сервис, Вы соглашаетесь на сбор и использование информации в
          соответствии с настоящей Политикой конфиденциальности.
          <br />
          <br />
          Данная политика конфиденциальности распространяется на информацию,
          которую Вы предоставляете на сайте LibertyMeets.com.
        </p>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.termsTitle}>Какую информацию мы собираем</h4>
        <p className={styles.termsDescription}>
          Мы можем собирать, использовать, передавать и раскрывать вашу
          информацию в следующих целях следующих целей:
        </p>
        <ul className={styles.termsList}>
          <li>для облегчения и предоставления запрошенных вами услуг;</li>
          <li>
            предоставить Вам информацию, которую Вы запрашиваете или которую Вы
            можете необходимо, чтобы связаться с Нами (например, если Вы
            отправляете комментарий, вопрос или жалоба к Нам, Мы можем ответить
            на Ваше сообщение);
          </li>
          <li>для внутреннего учета;</li>
          <li>для администрирования Сервиса;</li>
          <li>для связи с вами относительно Сервиса;</li>
          <li>для улучшения и настройки Сервиса;</li>
          <li>уведомлять Вас об изменениях в Сервисе;</li>
          <li>уведомлять Вас об изменениях в Сервисе; </li>
          <li>соблюдать закон; </li>
          <li>
            как описано для вас в момент, когда вы предоставляете свою
            информацию нам.
          </li>
        </ul>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.termsTitle}>Как это работает?</h4>
        <p className={styles.termsDescription}>
          Мы используем Вашу информацию для предоставления и улучшения Услуги.
          Мы не передаем Вашу информацию третьим лицам.
        </p>
        <span className={styles.cookies}>
          СБОР И ИСПОЛЬЗОВАНИЕ ФАЙЛОВ COOKIE
        </span>
        <p className={styles.termsDescription}>
          Cookie - это небольшой фрагмент данных, хранящийся на вашем
          компьютере, который идентифицирует ваш браузер и что сделано с ним.
          Эта Политика конфиденциальности описывает нашу политику и процедуры по
          сбору, использованию и раскрытию Вашей информации, когда вы
          пользуетесь Услугой, и рассказывает вам о ваших правах на
          конфиденциальность и о том, как закон защищает вас. правах и о том,
          как закон защищает вас. Мы используем Ваши персональные данные для
          предоставления и улучшения Сервиса. Пользуясь Сервисом, Вы
          соглашаетесь на сбор и использование информации в соответствии с
          настоящей Политикой конфиденциальности.
        </p>
      </div>
    </section>
  );
}
