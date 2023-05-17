import styles from "./Registration.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";
import axios, { AxiosError } from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PASSWORD_VALIDATION_PATTERN } from "../../utils/stringUtils";

type PropsType = { appUrl: string; recaptchaKey: string };

export default function Registration({ appUrl, recaptchaKey }: PropsType) {
  const [terms, setTerms] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const recaptchaRef = createRef<ReCAPTCHA>();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    session?.user && router.push("/posts");
  }, [router, session]);

  const error = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
      duration: 2.5,
      style: {
        marginTop: "10vh",
      },
    });
  };

  async function onFinish(values: any) {
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue || !terms) {
      if (!terms && !recaptchaValue) {
        error(
          "Похоже, что вы не согласились с нашими условиями и не прошли проверку reCAPTCHA"
        );
        return;
      } else if (!terms) {
        error("Похоже, что вы не согласились с нашими условиями");
        return;
      } else {
        error("Похоже, что вы не прошли проверку reCAPTCHA");
      }
    }

    values.recaptchaValue = recaptchaValue;

    try {
      const req = await axios.post(`${appUrl}/api/users/registration`, values);
      if (req.status === 200) {
        router.push("/auth/activate");
      }
    } catch (err) {
      error(
        "Пожалуйста, повторите попытку позже или обратитесь за помощью в нашу службу поддержки клиентов"
      );
      recaptchaRef.current?.reset();
    }
  }

  return (
    <section className={styles.registarationWrapper}>
      <div className={styles.error}>{contextHolder}</div>
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
              { required: true, message: "Пожалуйста, введите пароль" },
              {
                pattern: PASSWORD_VALIDATION_PATTERN,
                max: 100,
                message:
                  "Минимум 8 символов, минимум 1 строчная буква, 1 заглавная буква, 1 специальный символ и 1 цифра",
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
                Я согласен на
                <Link
                  target="_blank"
                  href={`${appUrl}/terms`}
                  rel="noopener noreferrer"
                  className={styles.termsLink}
                >
                  Условия использования
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
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <Link className={styles.link} href={"/signin"}>
          Уже зарегистрированы?
        </Link>
      </div>
    </section>
  );
}
