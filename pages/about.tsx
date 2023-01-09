import styles from "../styles/about.module.css";

export default function About() {
  return (
    <div className="defaultPage">
        <div>
          <div className={styles.aboutTitle}>What Is LibertyMeets?</div>
          <div className={styles.aboutDescription}>
            Unlike social media sites, LibertyMeets is geared toward in-person
            connections to form local bonds and take action in your community.
            Explore and post opportunities to find other freedom-oriented
            individuals, businesses, non-profits, and campaigns.
          </div>
        </div>

        <div>
          <div className={styles.aboutTitle}>Your Privacy Is Paramount</div>
          <div className={styles.aboutDescription}>
            Sign up information is to ensure users are connecting with real
            people. Other than that, your business isn’t our business. We do not
            and will not share or sell your information. When someone replies to
            your post, or you reply to a post, your email address is anonymous.
          </div>
        </div>

        <div>
          <div className={styles.aboutTitle}>How Does It Work?</div>
          <div className={styles.aboutDescription}>
            Simplicity and speed are our goals. Anyone can browse and respond to
            public posts. Sign up to post, view and respond to private posts,
            and keep track of your favorite posts. Here's a short video
            exploring the site's functionality.
          </div>
        </div>
    </div>
  );
}
