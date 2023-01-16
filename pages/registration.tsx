import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import config from "config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef, useState } from "react";

type PropsType = { appUrl: string; recaptchaKey: string };

type ErrorResponse = {
  message: string;
};

export default function Registration({ appUrl, recaptchaKey }: PropsType) {
  const [errorMessage, setErrorMessage] = useState<string>("");
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
        setErrorMessage("repeatPassword");
        return;
      }
      const recaptchaValue = recaptchaRef.current?.getValue();
      if (!recaptchaValue) {
        setErrorMessage("no recaptchaValue");
        return;
      }

      values.recaptchaValue = recaptchaValue;

      try {
        const req = await axios.post(
          `${appUrl}/api/users/registration`,
          values
        );
        if (req.status === 200) {
          router.push("/signin");
        }
      } catch (err) {
        const error = err as AxiosError;
        const response = error.response;
        setErrorMessage((response?.data as ErrorResponse).message);
      }
    },
  });

  return (
    <>
      {errorMessage ? <div>{errorMessage}</div> : <></>}
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
