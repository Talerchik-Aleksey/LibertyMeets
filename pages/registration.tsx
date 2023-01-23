import config from "config";
import { GetServerSideProps } from "next";
import RegistrationComponent from "../Components/General/Registration/RegistrationComponent";

type PropsType = { appUrl: string; recaptchaKey: string };

export default function Registration({ appUrl, recaptchaKey }: PropsType) {
  return <RegistrationComponent appUrl={appUrl} recaptchaKey={recaptchaKey} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  const recaptchaKey = config.get<string>("recaptcha.public_recaptcha_key");
  return {
    props: { appUrl, recaptchaKey },
  };
};
