import axios from "axios";
import { useFormik } from "formik";
import config from "config";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

type PropsType = { appUrl: string };

export default function Registration({ appUrl }: PropsType) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.repeatPassword) {
        alert("repeatPassword");
        return;
      }

      const req = await axios.post(`${appUrl}/api/users/registration`, values);
      if (req.status === 200) {
        router.push("/signin");
      } else {
        /**/
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <input
          name="email"
          placeholder="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
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
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
