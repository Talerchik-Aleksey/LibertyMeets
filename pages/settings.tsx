import axios from "axios";
import { useFormik } from "formik";
import config from "config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import styles from "../styles/signup.module.css";

type RegistrationProps = { appUrl: string };

export default function Registration({ appUrl }: RegistrationProps) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.repeatPassword) {
        alert("repeatPassword");
        return;
      }

      const req = await axios.post(`${appUrl}/api/users/change-password`, values);
      if (req.status === 200) {
        router.push("/signin");
      } else {
        /**/
      }
    },
  });

  return (
    <div style={{ height: "897px" }}>
      <form className={styles.loginBlock} onSubmit={formik.handleSubmit}>
        <div className={styles.inputBlock}>User Details</div>
        <div className={styles.inputBlock}>
          <div className={styles.fieldName}>New Password</div>
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
          <div className={styles.fieldName}>Repeat New Password</div>
          <input
            className={styles.inputField}
            name="repeatPassword"
            type="password"
            placeholder="********"
            onChange={formik.handleChange}
            value={formik.values.repeatPassword}
          />
        </div>
        <div className={styles.inputBlock}>
          <button
            type="submit"
            className="clickableText"
          >Save Changes</button>
        </div>
        <div className={styles.inputBlock}>
          <button
            className="clickableText"
          >Delete Account?</button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
