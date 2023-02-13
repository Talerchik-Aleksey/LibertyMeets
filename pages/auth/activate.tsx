import config from "config";
import { GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AuthActivated from "../../Components/AuthActivated/AuthActivated";

type ActivatePageProps = { appUrl: string };

export default function ActivatePage({ appUrl }: ActivatePageProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    if (session?.user === null) {
      session?.email && setEmail(session?.email);
      setTimeout(() => {
        signOut({ redirect: false });
      }, 5000);
    }
  }, [session]);

  return <AuthActivated appUrl={appUrl} email={email} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
