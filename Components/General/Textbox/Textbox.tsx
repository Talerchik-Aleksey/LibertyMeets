import styles from "./Textbox.module.scss";

export default function Textbox() {
  return (
    <section className={styles.container}>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>What Is LibertyMeets?</h4>
        <p className={styles.textboxDescription}>
          Unlike social media sites, LibertyMeets is geared toward in-person
          connections to form local bonds and take action in your community.
          Explore and post opportunities to find other freedom-oriented
          individuals, businesses, non-profits, and campaigns.
        </p>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>Your Privacy Is Paramount</h4>
        <p className={styles.textboxDescription}>
          Sign up information is to ensure users are connecting with real
          people. Other than that, your business isn’t our business. We do not
          and will not share or sell your information. When someone replies to
          your post, or you reply to a post, your email address is anonymous.
        </p>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>How Does It Work?</h4>
        <p className={styles.textboxDescription}>
          Simplicity and speed are our goals. Anyone can browse and respond to
          public posts. Sign up to post, view and respond to private posts, and
          keep track of your favorite posts. Heres a short video exploring the
          sites functionality.
        </p>
      </div>
    </section>
  );
}
