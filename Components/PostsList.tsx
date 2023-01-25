import { PostType } from "../types/general";
import Event from "./Event/Event";

type PostListProps = {
  posts: PostType[];
  changeStar: (postId: number) => void;
  isViewForAllCategory: boolean;
};

export default function PostsList(props: PostListProps) {
  const { posts, changeStar, isViewForAllCategory } = props;

  return (
    <>
      {posts.map((post) => (
        <Event
          key={post.id}
          post={post}
          changeStar={changeStar}
          isViewForAllCategory={isViewForAllCategory}
        />
      ))}
    </>
  );
}
