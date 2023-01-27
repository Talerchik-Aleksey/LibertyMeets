import { GetServerSideProps } from "next";
import config from "config";
import Events from "../Components/Events/Events";

type PropsType = { appUrl: string; postsPerPage: number };

export default function PostsPage({ appUrl, postsPerPage }: PropsType) {
  return (
    <>
      <Events appUrl={appUrl} postsPerPage={postsPerPage} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const emailParams = {
  //   subject:"",
  //   to: {
  //     email: "vburdylev@twelvedevs.com",
  //   },
  // };
  // await sendEmail("reset-password", emailParams, {user:{name:"MyName"}});

  const appUrl = process.env.NEXTAUTH_URL || config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");

  return {
    props: { appUrl, postsPerPage },
  };
};
