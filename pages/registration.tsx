import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import config from "config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef, useState } from "react";
import * as Yup from "yup";

type PropsType = { appUrl: string; recaptchaKey: string };

type ErrorResponse = {
  message: string;
};

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .max(100, "less than 100 characters")
    .required("Required"),
  password: Yup.string()
    .min(4, "at least 4 characters")
    .max(100, "less than 100 characters")
    .required("Required"),
  repeatPassword: Yup.string()
    .min(4, "at least 4 characters")
    .max(100, "less than 100 characters")
    .required("Required"),
});

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
    validationSchema: SignupSchema,
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
        <div>
          <input
            name="email"
            placeholder="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <span>{formik.errors.email}</span>
          )}
        </div>
        <div>
          <input
            name="password"
            placeholder="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <span>{formik.errors.password}</span>
          )}
        </div>
        <div>
          <input
            name="repeatPassword"
            placeholder="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.repeatPassword}
          />
          {formik.touched.repeatPassword && formik.errors.repeatPassword && (
            <span>{formik.errors.repeatPassword}</span>
          )}
        </div>
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
