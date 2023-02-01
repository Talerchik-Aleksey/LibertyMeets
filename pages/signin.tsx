import { GetServerSideProps } from "next";
import Login from "../Components/Login/Login";
import config from "config";

type PropsType = {
  appUrl: string;
};

export default function signin({ appUrl }: PropsType) {
  return (
    <>
      <Login appUrl={appUrl} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");

  return {
    props: { appUrl },
  };
};
