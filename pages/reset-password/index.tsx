import config from "config";
import { GetServerSideProps } from "next";
import ResetPasswordComponent from "../../Components/General/ResetPasswordComponent/ResetPasswordComponent";

type ResetPasswordProps = { appUrl: string };

export default function ResetPassword({ appUrl }: ResetPasswordProps) {
  return (
    <>
      <ResetPasswordComponent appUrl={appUrl} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
