import { BuiltInProviderType } from "next-auth/providers";
import {
  signIn,
  getSession,
  getCsrfToken,
  getProviders,
  ClientSafeProvider,
  LiteralUnion,
} from "next-auth/react";
import { useRouter } from "next/router";
import CrossesOnBackground from "../Components/General/CrossesOnBackground";
import LibertyMeetsLogo from "../Components/LibertyMeetsLogo";
import styles from "../styles/signup.module.css";

export default function signin() {
  const router = useRouter();
  return (
    <>
      <CrossesOnBackground />
      <div style={{ height: "897px" }}>
        <div className={styles.loginBlock}>
          <LibertyMeetsLogo size={1} />
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Email</div>
            <input
              className={styles.inputField}
              placeholder="spencer@libertymeets.com"
            />
          </div>
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Password</div>
            <input
              className={styles.inputField}
              type="password"
              placeholder="********"
            />
          </div>
          <div className={styles.inputBlock}>
            <input className={styles.rememberMeCheckbox} type="checkbox" />
            <label className={styles.rememberMe}>Remember Me</label>
            <div className="clickableText" onClick={()=>router.push("/resetPassword")}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
