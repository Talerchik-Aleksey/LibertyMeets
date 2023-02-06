import { PostType } from "../../types/general";
import styles from "./Location.module.scss";

type LocationProps = {
  post: PostType;
};

export default function Location(props: LocationProps) {
  const { post } = props;

  return (
    <div className={styles.location}>
      {post.location_name
        ? `${post.location_name}`
        : `${post.city}, ${post.state}`}
    </div>
  );
}
