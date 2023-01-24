import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";
import CrossesOnBackground from "../Components/General/CrossesOnBackground";
import LibertyMeetsLogo from "../Components/LibertyMeetsLogo";
import styles from "../styles/signup.module.css";
import * as Yup from "yup";

const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function signin() {
  const router = useRouter();
  const { data: session } = useSession();

  function goBack() {
    const callback = router.query.callback;
    return callback ? router.back() : router.push("/");
  }

  if (session) {
    goBack();
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SigninSchema,
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
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <span>{formik.errors.email}</span>
            )}
          </div>
          <div className={styles.inputBlock}>
            <div className={styles.fieldName}>Password</div>
            <input
              className={styles.inputField}
              name="password"
              type="password"
              placeholder="********"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <span>{formik.errors.password}</span>
            )}
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
