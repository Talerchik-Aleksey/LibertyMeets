import { Button, Form, Input } from "antd";
import styles from "./Settings.module.scss";
import Image from "next/image";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Navigation from "../MyProfileNavigation/Navigation";

type ErrorResponse = {
  message: string;
};
type SettingsProps = { appUrl: string };

export default function Settings(props: SettingsProps) {
  const { appUrl } = props;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isUpdatedPassword, setIsUpdatedPassword] = useState<boolean>();
  const router = useRouter();

  async function onFinish(values: any) {
    if (values.password !== values.repeatPassword) {
      setErrorMessage("repeat password");
      return;
    }

    try {
      const req = await axios.post(
        `${appUrl}/api/users/change-password`,
        values
      );
      if (req.status === 200) {
        setIsUpdatedPassword(true);
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  async function deleteAccount() {
    try {
      const res = await axios.post(`${appUrl}/api/users/deleteAccount`);
      if (res.status === 200) {
        signOut({ callbackUrl: "/" });
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  return (
    <div className={styles.profileWrapper}>
      <Navigation />
      <div className={styles.wrap}>
        <div className={styles.container}>
          <span className={styles.userTitle}>User Details</span>
          {isUpdatedPassword ? (
            <div>Your password was updated successfully.</div>
          ) : (
            <div>{errorMessage}</div>
          )}

          <Form
            name="settings"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className={styles.form}
          >
            <Form.Item
              name="password"
              label="Password"
              colon={false}
              labelCol={{ span: 3 }}
              labelAlign="left"
              className={styles.password}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                { type: "string", min: 4, max: 100 },
              ]}
              hasFeedback
            >
              <Input.Password className={styles.input} />
            </Form.Item>

            <Form.Item
              name="repeatPassword"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              colon={false}
              labelCol={{ span: 3 }}
              labelAlign="left"
              className={styles.password}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password className={styles.input} />
            </Form.Item>
            <Form.Item>
              <div className={styles.buttonBlock}>
                <Button className={styles.btn} htmlType="submit">
                  <Image
                    src="/decor/preview.svg"
                    alt=""
                    width={16}
                    height={14}
                    className={styles.vector}
                  />
                  <span className={styles.signUp}>Save Changes</span>
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.deleteBlock}>
          <Button className={styles.btnDelete}>
            <Image
              src="/decor/delete.svg"
              alt=""
              width={14}
              height={16}
              className={styles.vector}
            />
            <span className={styles.deleteText} onClick={deleteAccount}>
              Delete Account?
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
