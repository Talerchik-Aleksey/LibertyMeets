import styles from "./Registration.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Form, Input } from "antd";
import axios, { AxiosError } from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef, useEffect, useState } from "react";
import { getSession } from "next-auth/react";

type PropsType = { appUrl: string; recaptchaKey: string };

type ErrorResponse = {
  message: string;
};

export default function Registration({ appUrl, recaptchaKey }: PropsType) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [terms, setTerms] = useState<boolean>(false);
  const recaptchaRef = createRef<ReCAPTCHA>();
  const router = useRouter();
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
  );

  useEffect(() => {
    (async () => {
      const session = await getSession();
      session?.user && router.push("/posts");
    })();
  });

  async function onFinish(values: any) {
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue || !terms) {
      if (!terms && !recaptchaValue) {
        setErrorMessage("no recaptchaValue and terms");
        return;
      } else if (!terms) {
        setErrorMessage("no terms");
        return;
      } else {
        setErrorMessage("no recaptchaValue");
      }
    }

    values.recaptchaValue = recaptchaValue;

    try {
      const req = await axios.post(`${appUrl}/api/users/registration`, values);
      if (req.status === 200) {
        router.push("/auth/activate");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
      recaptchaRef.current?.reset();
    }
  }

  return (
    <section className={styles.registarationWrapper}>
      <div className={styles.formBlock}>
        <div className={styles.logoInfo}>
          <div className={styles.logo}>
            <Image
              src="/decor/Unframed.svg"
              alt=""
              width={238}
              height={280}
              className={styles.logoImage}
            />
          </div>
        </div>
        {errorMessage ? <div>{errorMessage}</div> : <></>}
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className={styles.form}
          validateTrigger={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true },
              { type: "email" },
              { type: "string", max: 100 },
            ]}
            colon={false}
            labelAlign="left"
            label="Email"
            labelCol={{ span: 5 }}
            className={styles.email}
          >
            <Input
              suffix={
                <Image
                  src="/decor/fax.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
              }
              placeholder="Email"
              className={styles.inputEmail}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            colon={false}
            labelCol={{ span: 5 }}
            className={styles.password}
            labelAlign="left"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: passwordRegex,
                max: 100,
                message:
                  "Minimum 8 characters, at least 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number",
              },
            ]}
          >
            <Input
              suffix={
                <Image
                  src="/decor/lock.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
              }
              type="password"
              placeholder="Password"
              className={styles.inputPassword}
            />
          </Form.Item>

          <div className={styles.checkboxBlock}>
            <label className={styles.container}>
              <span className={styles.checkboxText}>
                {" "}
                I have read the{" "}
                <Link
                  target="_blank"
                  href={`${appUrl}/terms`}
                  rel="noopener noreferrer"
                  className={styles.termsLink}
                >
                  Terms & Privacy Policy
                </Link>
              </span>
              <input
                type="checkbox"
                className={styles.checkHighload}
                onClick={() => {
                  setTerms((terms) => !terms);
                }}
              />
              <span className={styles.highload2}></span>
            </label>

            <div className={styles.capchaBlock}>
              <ReCAPTCHA
                sitekey={recaptchaKey}
                ref={recaptchaRef}
                className={styles.capcha}
              />
            </div>
          </div>

          <Form.Item className={styles.signUp}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonSignUp}
            >
              <Image
                src="/decor/loginim.svg"
                alt=""
                width={16}
                height={14}
                className={styles.loginImage}
              />
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Link className={styles.link} href={"/signin"}>
          I already have an account!
        </Link>
      </div>
    </section>
  );
}
