import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import config from 'config';
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

type propsType = { appUrl: string };
const EMAIL = 'dkarpekin@12devs.com';

export default function VerifyUser({ appUrl }: propsType){
  const [isRightEmail, setIsRightEmail] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    (async() => {
      const req = await axios.post(`${appUrl}/api/users/verification`, { email: EMAIL });
        if (req.status === 200) {
          setIsRightEmail(true);
        } else {
          router.push("/reset-password/expired-token");
        }
    })();
  }, [appUrl, router]);

  const formik = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.repeatPassword) {
        alert("repeatPassword");
        return;
      }

      const valuesForResetToken = {
        password: values.password,
        token: router.query.token
      }

      const req = await axios.post(`${appUrl}/api/users/set-password`, valuesForResetToken);
      if (req.status === 200) {
        router.push("/signin");
      } else {
        router.push("/reset-password/expired-token");
      }
    },
  });

  if (typeof window === "undefined") return null;

  return(
    <div>
    {isRightEmail ?
      <form onSubmit={formik.handleSubmit}>
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
      </form> :
      <></>
      }
        <div style={{ height: "897px" }}>HELLO</div>
      </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
