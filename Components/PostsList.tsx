import { PostType } from "../types/general";
import PostListItem from "./PostListItem";
import EventSingleRow from "../Components/EventSingleRow/EventSingleRow";

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
        <EventSingleRow
          key={post.id}
          post={post}
          appUrl={appUrl}
          changeStar={changeStar}
        />
        // <PostListItem
        //   key={post.id}
        //   post={post}
        //   appUrl={appUrl}
        //   changeStar={changeStar}
        // />
      ))}
    </>
  );
}
