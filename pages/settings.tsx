import config from "config";
import { GetServerSideProps } from "next";
import Settings from "../Components/General/Settings/Settings";

type SettingsProps = { appUrl: string };

export default function SettingsPage({ appUrl }: SettingsProps) {
  return <Settings appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
