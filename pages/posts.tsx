import { GetServerSideProps } from "next";
import config from "config";
import Events from "../Components/Events/Events";
import { PostType } from "../types/general";
import { getPosts } from "../services/posts";
import { getSession } from "next-auth/react";

type PostsPageProps = {
  appUrl: string;
  postsPerPage: number;
  posts: PostType[];
  count: number;
};

export default function PostsPage({
  appUrl,
  postsPerPage,
  posts,
  count,
}: PostsPageProps) {
  return (
    <>
      <Events
        appUrl={appUrl}
        postsPerPage={postsPerPage}
        initialPosts={posts}
        initialCount={count}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PostsPageProps> = async (
  ctx
) => {
  // const emailParams = {
  //   subject:"",
  //   to: {
  //     email: "vburdylev@twelvedevs.com",
  //   },
  // };
  // await sendEmail("reset-password", emailParams, {user:{name:"MyName"}});

  const appUrl = process.env.NEXTAUTH_URL || config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");
  const session = await getSession({ req: ctx.req });
  const searchParams = {
    page: Number(ctx.query.page),
    category: ctx.query.category,
    zip: ctx.query.zip,
    lat: ctx.query.lat,
    lng: ctx.query.lng,
    radius: ctx.query.radius,
  };

  if (isNaN(searchParams.page)) {
    searchParams.page = 1;
  }

  console.log(searchParams);

  const res = await getPosts(session?.user, searchParams);
  if (!res) {
    return {
      notFound: true,
    };
  }

  const posts = res.posts
    .map((item) => item.toJSON())
    .map((item) => {
      item.created_at = item.created_at.toISOString();
      return item;
    });

  const count = res.count;

  return {
    props: {
      appUrl,
      postsPerPage,
      posts,
      count,
    },
  };
};
