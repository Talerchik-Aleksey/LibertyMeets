import config from "config";
import { GetServerSideProps } from "next";
import ChangePasswordComponent from "../../../Components/General/ChangePasswordComponent/ChangePasswordComponent";

type ChangePasswordProps = { appUrl: string };

export default function ChangePassword({ appUrl }: ChangePasswordProps) {
  return <ChangePasswordComponent appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
