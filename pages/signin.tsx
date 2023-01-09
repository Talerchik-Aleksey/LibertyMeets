import { signIn, getCsrfToken, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CrossesOnBackground from "../Components/General/CrossesOnBackground";
import LibertyMeetsLogo from "../Components/LibertyMeetsLogo";
import styles from "../styles/signup.module.css";

export default function signin(props: { csrfToken: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    router.push("/");
  }

  const handleLoginUser = async (e: any) => {
    e.preventDefault();
    await signIn("credentials", {
      redirect: true,
      email: "123",
      password: "123",
    });
  };
  return (
    <>
      <CrossesOnBackground />
      <div style={{ height: "897px" }}>
        <div className={styles.loginBlock}>
          <LibertyMeetsLogo size={1} />
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Email</div>
            <input
              name="email"
              className={styles.inputField}
              placeholder="spencer@libertymeets.com"
            />
          </div>
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Password</div>
            <input
              className={styles.inputField}
              name="password"
              type="password"
              placeholder="********"
            />
          </div>
          <div className={styles.inputBlock}>
            <input className={styles.rememberMeCheckbox} type="checkbox" />
            <label className={styles.rememberMe}>Remember Me</label>
            <div
              className="clickableText"
              onClick={() => router.push("/resetPassword")}
            ></div>
          </div>
          <button type="submit">Log In</button>
        </div>
      </div>
      <button onClick={handleLoginUser}>Log In</button>
    </>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
