import React from "react";
import Image from "next/image";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import styles from "./ChangePasswordComponent.module.scss";
import RectangleLeft from "../RectangleLeft/RectangleLeft";
import RectangleRight from "../RectangleRight/RectangleRight";
import axios from "axios";
import { useEffect, useState } from "react";

type ChangePasswordProps = { appUrl: string };

export default function ChangePasswordComponent({
  appUrl,
}: ChangePasswordProps) {
  const [isRightUser, setIsRightUser] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const req = await axios.post(`${appUrl}/api/users/verification`, {
        token: router.query.token,
      });
      if (req.status === 200) {
        setIsRightUser(true);
      } else {
        router.push("/reset-password/expired-token");
      }
    })();
  }, [appUrl, router]);

  async function onFinish(values: any) {
    if (values.password !== values.repeatPassword) {
      alert("repeatPassword");
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
      {isRightUser ? (
        <div className={styles.loginWrapper}>
          <div className={styles.leftBlock}>
            <RectangleLeft />
          </div>
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
            >
              <Form.Item
                label="* Password"
                name="password"
                colon={false}
                labelCol={{ span: 4 }}
                labelAlign="left"
                className={styles.password}
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

              <Form.Item
                label="* Password"
                name="repeatPassword"
                colon={false}
                labelCol={{ span: 4 }}
                labelAlign="left"
                className={styles.password}
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
            </Form>
          </div>
          <div className={styles.rightBlock}>
            <RectangleRight />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
