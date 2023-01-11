import axios from "axios";
import { useFormik } from "formik";
import config from "config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import styles from "../styles/signup.module.css";

type propsType = { appUrl: string };

export default function Registration({ appUrl }: propsType) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    onSubmit: async (values) => {
      // if (values.password !== values.repeatPassword) {
      //   alert("repeatPassword");
      //   return;
      // }
      console.log('values <-------', values);

      // const req = await axios.post(`${appUrl}/api/users/change-password`, values);
      // if (req.status === 200) {
      //   router.push("/signin");
      // } else {
      //   /**/
      // }
    },
  });

  return (
    <div style={{ height: "897px" }}>
      <form className={styles.loginBlock} onSubmit={formik.handleSubmit}>
        <div className={styles.inputBlock}>User Details</div>
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
          <button
            type="submit"
            className="clickableText"
            // onClick={() => router.push("/resetPassword")}
          >Save Changes</button>
        </div>
        <div className={styles.inputBlock}>
          <button
            className="clickableText"
            // onClick={() => router.push("/resetPassword")}
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
