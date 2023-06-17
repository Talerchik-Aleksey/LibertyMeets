import config from "config";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { PreviewPost } from "@/components/CreatePost/PreviewPost";

type PropsType = { appUrl: string };

export default function PreviewPostPage({ appUrl }: PropsType) {
  return <PreviewPost appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  if (!session?.user) {
    return {
      notFound: true,
    };
  }

  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
