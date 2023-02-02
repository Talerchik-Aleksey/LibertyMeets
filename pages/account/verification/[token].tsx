import axios from "axios";
import config from "config";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountToken from "../../../Components/General/AccountStatus/AccountToken";
import signin from "../../signin";

type ChangeAccountStateProps = { appUrl: string };

export default function ChangeAccountStatePage({
  appUrl,
}: ChangeAccountStateProps) {
  const [isError, setIsError] = useState<boolean>(false);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const req = await axios.post(`${appUrl}/api/users/email-verification`, {
        token: router.query.token,
      });

      if (req.status !== 200) {
        setIsError(true);
        return;
      }

      setTimeout(async () => {
        const values = req.data;
        await signIn("credentials", { ...values, callbackUrl: "/posts" });
      }, 5000);
    })();
  }, [appUrl, router]);

  return isError ? (
    <AccountToken isError={true} />
  ) : (
    <AccountToken isError={false} />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");

  return {
    props: { appUrl },
  };
};
