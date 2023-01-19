import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import config from "config";
import { GetServerSideProps } from "next";
import styles from "../styles/signup.module.css";
import { useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

type SettingsProps = { appUrl: string };
type ErrorResponse = {
  message: string;
};

export default function Settings({ appUrl }: SettingsProps) {
  const [isUpdatedPassword, setIsUpdatedPassword] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
    },
    onSubmit: async (values) => {
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
    },
  });

  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`${appUrl}/${path}`);
  };

  async function deleteAccount() {
    try {
      const res = await axios.post(`${appUrl}/api/users/deleteAccount`);
      if (res.status === 200) {
        signOut({ callbackUrl: "/registration" });
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  return (
    <div style={{ height: "897px" }}>
      <div>
        <Button type="text" onClick={() => handleClick("myFavoritesPosts")}>
          My Favorites
        </Button>
        <Button type="text" onClick={() => handleClick("myPosts")}>
          My Posts
        </Button>
        <Button type="text" onClick={() => handleClick("settings")}>
          Settings
        </Button>
      </div>
      <form className={styles.loginBlock} onSubmit={formik.handleSubmit}>
        <div className={styles.inputBlock}>User Details</div>
        {isUpdatedPassword ? (
          <div>Your password was updated successfully.</div>
        ) : (
          <div>{errorMessage}</div>
        )}
        <div className={styles.inputBlock}>
          <div className={styles.fieldName}>New Password</div>
          <input
            className={styles.inputField}
            name="password"
            type="password"
            placeholder="********"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </div>
        <div className={styles.inputBlock}>
          <div className={styles.fieldName}>Repeat New Password</div>
          <input
            className={styles.inputField}
            name="repeatPassword"
            type="password"
            placeholder="********"
            onChange={formik.handleChange}
            value={formik.values.repeatPassword}
          />
        </div>
        <div className={styles.inputBlock}>
          <button type="submit" className="clickableText">
            Save Changes
          </button>
        </div>
      </form>
      <div className={styles.inputBlock}>
        <button className="clickableText" onClick={deleteAccount}>
          Delete Account?
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
