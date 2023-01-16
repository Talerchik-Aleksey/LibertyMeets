import axios from "axios";
import { useFormik } from "formik";
import config from "config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef } from "react";

type PropsType = { appUrl: string; recaptchaKey: string };

export default function Registration({ appUrl, recaptchaKey }: PropsType) {
  const recaptchaRef = createRef<ReCAPTCHA>();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
      recaptchaValue: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.repeatPassword) {
        alert("repeatPassword");
        return;
      }
      const recaptchaValue = recaptchaRef.current?.getValue();
      if (!recaptchaValue) {
        return;
      }
      await axios.post(`${appUrl}/api/recaptcha`, recaptchaValue);

      const req = await axios.post(`${appUrl}/api/users/registration`, values);
      if (req.status === 200) {
        router.push("/signin");
      } else {
        /**/
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <input
          name="email"
          placeholder="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <input
          name="password"
          placeholder="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <input
          name="repeatPassword"
          placeholder="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.repeatPassword}
        />
        <button type="submit">Submit</button>
        <ReCAPTCHA
          sitekey={recaptchaKey}
          onChange={formik.handleChange}
          ref={recaptchaRef}
        />
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  const recaptchaKey = config.get<string>("recaptcha.public_recaptcha_key");
  return {
    props: { appUrl, recaptchaKey },
  };
};
