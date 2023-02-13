import { Button } from "antd";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import styles from "./AuthActivated.module.scss";
import Image from "next/image";

type PropsType = {
  appUrl: string;
  email: string | undefined;
};

type ErrorResponse = {
  message: string;
};

export default function AuthActivated({ appUrl, email }: PropsType) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    email && setIsVisible(true);
  }, [email]);

  async function resendEmail() {
    try {
      const res = await axios.post(`${appUrl}/api/users/resendEmail`, {
        email,
      });
      if (res.status === 200) {
        setIsVisible(false);
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  return (
    <div className={styles.container}>
      {errorMessage ? <div>{errorMessage}</div> : <></>}
      {isVisible ? (
        <div className={styles.blockResend}>
          <div className={styles.text}>
            Do You need to send the letter again?
          </div>
          <Button type="text" className={styles.resend} onClick={resendEmail}>
            <Image
              src="/decor/reset.svg"
              alt=""
              width={14}
              height={16}
              className={styles.reset}
            />
            Resend
          </Button>
        </div>
      ) : (
        <></>
      )}
      <p className={styles.message}>
        Your account has been created, but in order to use it fully, you need to
        activate your email. We have sent a confirmation email to the address
        you provided. Please follow the instructions in the email to complete
        the activation process. If you have not received the email, please check
        your spam folder.
      </p>
    </div>
  );
}
