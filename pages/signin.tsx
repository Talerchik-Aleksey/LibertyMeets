import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CrossesOnBackground from "../Components/General/CrossesOnBackground";
import LibertyMeetsLogo from "../Components/LibertyMeetsLogo";
import styles from "../styles/signup.module.css";

export default function signin() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    router.push("/");
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await signIn("credentials", values);
    },
  });

  return (
    <>
      <CrossesOnBackground />
      <div style={{ height: "897px" }}>
        <form className={styles.loginBlock} onSubmit={formik.handleSubmit}>
          <LibertyMeetsLogo size={1} />
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Email</div>
            <input
              name="email"
              className={styles.inputField}
              placeholder="spencer@libertymeets.com"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Password</div>
            <input
              className={styles.inputField}
              name="password"
              type="password"
              placeholder="********"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </div>
          <div className={styles.inputBlock}>
            <input className={styles.rememberMeCheckbox} type="checkbox" />
            <label className={styles.rememberMe}>Remember Me</label>
            <div
              className="clickableText"
              onClick={() => router.push("/reset-password")}
            ></div>
          </div>
          <button type="submit">Log In</button>
        </form>
      </div>
    </>
  );
}
