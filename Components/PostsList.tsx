import { PostType } from "../types/general";
import PostListItem from "./PostListItem";

type PostListProps = {
  posts: PostType[];
  appUrl: string;
  changeStar: (postId: number) => void;
};

export default function PostsList(props: PostListProps) {
  const { posts, appUrl, changeStar } = props;

  return (
    <>
      {posts.map((post) => (
        <PostListItem
          key={post.id}
          post={post}
          appUrl={appUrl}
          changeStar={changeStar}
        />
      ))}
    </>
  );
}
