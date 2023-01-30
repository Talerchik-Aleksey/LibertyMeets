import { GetServerSideProps } from "next";
import config from "config";
import { getFavoritesPosts } from "../services/posts";
import { getSession } from "next-auth/react";
import MyPosts from "../Components/MyPosts/MyPosts";
import { PostType } from "../types/general";

type MyFavoritesPostsPageProps = {
  appUrl: string;
  postsPerPage: number;
  posts: PostType[];
  count: number;
};

export default function MyFavoritesPostsPageProps({
  appUrl,
  postsPerPage,
  posts,
  count,
}: MyFavoritesPostsPageProps) {
  return (
    <>
      <MyPosts
        appUrl={appUrl}
        postsPerPage={postsPerPage}
        initialPosts={posts}
        initialCount={count}
        postsIsFavorites={true}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  MyFavoritesPostsPageProps
> = async (ctx) => {
  const appUrl = process.env.NEXTAUTH_URL || config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");

  const session = await getSession({ req: ctx.req });
  if (!session) {
    return {
      notFound: true,
    };
  }

  let page = Number(ctx.query.page);
  if (isNaN(page)) {
    page = 1;
  }

  const res = await getFavoritesPosts(page, session.user);
  if (!res) {
    return {
      notFound: true,
    };
  }

  const posts = res.posts
    .map((item) => item.toJSON())
    .map((item) => {
      item.event_time = item.event_time.toISOString();
      item.is_favorite = true;
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
