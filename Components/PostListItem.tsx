import { PostType } from "../types/general";
import { useRouter } from "next/router";

export default function PostListItem(
  posts: PostType[],
  appUrl: string,
  changeStar: (postId: number) => void
) {
  const router = useRouter();

  const goToPostPage = (post_id: number) => {
    router.push(`${appUrl}/events/${post_id}`);
  };

  return posts.map((item) => (
    <div key={`post ${item.id}`}>
      {item.favoriteUsers?.length > 0 || item.is_favorite ? (
        <div
          onClick={() => {
            changeStar(item.id);
          }}
        >
          star{" "}
        </div>
      ) : (
        <div
          onClick={() => {
            changeStar(item.id);
          }}
        >
          no star
        </div>
      )}
      <div onClick={() => goToPostPage(item.id)}>
        {item.category} {item.title} {item.geo} {item.event_time}
        <hr />
      </div>
    </div>
  ));
}
