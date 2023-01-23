import styles from "./RegistrationComponent.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Form, Input } from "antd";
import axios, { AxiosError } from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef, useState } from "react";
import RectangleLeft from "../RectangleLeft/RectangleLeft";
import RectangleRight from "../RectangleRight/RectangleRight";

type PropsType = { appUrl: string; recaptchaKey: string };

type ErrorResponse = {
  message: string;
};

export default function RegistrationComponent({
  appUrl,
  recaptchaKey,
}: PropsType) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const recaptchaRef = createRef<ReCAPTCHA>();
  const router = useRouter();

  async function onFinish(values: any) {
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setErrorMessage("no recaptchaValue");
      return;
    }

    values.recaptchaValue = recaptchaValue;

    try {
      const req = await axios.post(`${appUrl}/api/users/registration`, values);
      if (req.status === 200) {
        router.push("/signin");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  return (
    <div className={styles.signUpWrapper}>
      <div className={styles.rectangleLeft}>
        <RectangleLeft />
      </div>
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
        >
          <Form.Item
            name="email"
            rules={[
              { required: false, message: "Please input your Username!" },
            ]}
            colon={false}
            labelAlign="left"
            label="* Email"
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
            label="* Password"
            name="password"
            colon={false}
            labelCol={{ span: 5 }}
            className={styles.password}
            labelAlign="left"
            rules={[
              { required: false, message: "Please input your password!" },
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
                <Link href="" className={styles.checkboxTerms}>
                  {" "}
                  Terms & Privacy Policy
                </Link>
              </span>
              <input type="checkbox" className={styles.checkHighload} />
              <span className={styles.highload2}></span>
            </label>

            <div className={styles.capchaBlock}>
              <ReCAPTCHA sitekey={recaptchaKey} ref={recaptchaRef} />
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

        <Link className={styles.link} href={""}>
          I already have an account!
        </Link>
      </div>
      <div className={styles.rectangleRight}>
        <RectangleRight />
      </div>
    </div>
  );
}
