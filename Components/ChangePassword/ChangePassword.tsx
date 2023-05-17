import React from "react";
import Image from "next/image";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import styles from "./ChangePassword.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { PASSWORD_VALIDATION_PATTERN } from "../../utils/stringUtils";

type ChangePasswordProps = { appUrl: string };

export default function ChangePassword({ appUrl }: ChangePasswordProps) {
  const [isPasswordsEqual, setIsPasswordsEqual] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const req = await axios.post(`${appUrl}/api/users/verification`, {
        token: router.query.token,
      });
      if (req.status !== 200) {
        router.push("/reset-password/expired-token");
      }
    })();
  }, [appUrl, router]);

  useEffect(() => {
    setTimeout(() => {
      setIsPasswordsEqual(true);
    }, 10_000);
  });

  async function onFinish(values: any) {
    if (values.password !== values.repeatPassword) {
      setIsPasswordsEqual(false);
      return;
    }

    const valuesForResetToken = {
      password: values.password,
      token: router.query.token,
    };

    const res = await axios.post(
      `${appUrl}/api/users/set-password`,
      valuesForResetToken
    );
    if (res.status === 200) {
      router.push("/signin");
    } else {
      router.push("/reset-password/expired-token");
    }
  }

  return (
    <>
      <section className={styles.changeWrapper}>
        <div className={styles.formBlock}>
          <div className={styles.logoInfo}>
            <div className={styles.goods}>
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
              label="Password"
              name="password"
              colon={false}
              labelCol={{ span: 4 }}
              labelAlign="left"
              className={styles.password}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите новый пароль!",
                },
                {
                  max: 100,
                  pattern: PASSWORD_VALIDATION_PATTERN,
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

            <Form.Item
              label="Password"
              name="repeatPassword"
              colon={false}
              labelCol={{ span: 4 }}
              labelAlign="left"
              className={styles.password}
              rules={[
                { required: true, message: "Пожалуйста повторите свой пароль" },
                {
                  max: 100,
                  pattern: PASSWORD_VALIDATION_PATTERN,
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
            <Form.Item className={styles.logIn}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.buttonLogIns}
              >
                <Image
                  src="/decor/login.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
                <span className={styles.buttonLogInsText}>Reset</span>
              </Button>
            </Form.Item>
            {isPasswordsEqual ||
              "Введенные вами новые пароли не совпадают. Убедитесь, что в полях &quot;Новый пароль&quot; и &quot;Повторный пароль&quot; содержится одинаковый текст, а затем повторите попытку. Если у вас по-прежнему возникают проблемы, обратитесь за помощью в нашу службу поддержки."}
          </Form>
        </div>
      </section>
    </>
  );
}
