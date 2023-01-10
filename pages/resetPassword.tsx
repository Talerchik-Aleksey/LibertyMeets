import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";
import LibertyMeetsLogo from "../Components/LibertyMeetsLogo";
import styles from "../styles/signup.module.css";
import { useState } from "react";

type propsType = { appUrl: string };

export default function ResetPassword({ appUrl }: propsType){
  const [isWrongEmail, setIsWrongEmail] = useState<boolean>(false);
  const [generateLink, setGenerateLink] = useState<string>('');
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    onSubmit: async (values) => {
      const req = await axios.post(`${appUrl}/api/users/reset-password`, values);
      if (req.status === 200) {
        setGenerateLink(`${appUrl}/resetPassword/verify/[${req.data.token}]`)
        router.push("/checkEmail");
      } else {
        setIsWrongEmail(true);
        router.push("/resetPassword");
      }
    },
  });

    return(
        <>
        <div style={{ height: "897px" }}>
          {isWrongEmail ? <div>This email not recognised</div> : <></>}
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
            <button type="submit">Send</button>
          </form>
      </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};