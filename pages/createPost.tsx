import config from "config";
import { GetServerSideProps } from "next";
import CreatePost from "../Components/CreatePost/CreatePost";

type PropsType = { appUrl: string };

export default function CreatePostPage({ appUrl }: PropsType) {
  return <CreatePost appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
