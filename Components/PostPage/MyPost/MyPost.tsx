import styles from "./MyPost.module.scss";
import Image from "next/image";
import { Button, Tooltip } from "antd";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  event_time: Date;
  category: string;
  description: string;
  is_public: boolean;
};
type PostProps = { appUrl: string; post: PostType };
type ErrorResponse = {
  status: string;
};

export default function MyPost(props: PostProps) {
  const [showList, setShowList] = useState<boolean>(false);
  const [post, setPost] = useState<PostType>(props.post);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data: session } = useSession();
  const appUrl = props.appUrl;
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../../Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  if (!post) {
    return null;
  }

  const coordinates = post.geo?.split(",");

  const postId = post.id;

  const isAuthor = session ? post?.author_id === session?.user.id : undefined;

  async function makePublic(is_public: boolean) {
    try {
      const res = await axios.post(`${appUrl}/api/posts/updatePost`, {
        postId,
        is_public,
      });
      if (res.status === 200) {
        setPost({ ...post, is_public } as PostType);
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).status);
    }
  }

  async function deletePost() {
    try {
      const res = await axios.post(`${appUrl}/api/posts/deletePost`, {
        postId,
      });
      if (res.status === 200) {
        router.push("/myPosts");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).status);
    }
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.arrow}>
        <Button
          className={styles.arrowBtn}
          type="link"
          onClick={() => router.push(`${appUrl}/myPosts`)}
        >
          <Image
            src="/decor/arrow-left.svg"
            alt=""
            width={45}
            height={42}
            className={styles.backImage}
          />
          <span className={styles.backBtn}>Back</span>
        </Button>
      </div>
      <div className={styles.livePostContainer}>
        <div style={{ display: "flex" }}>
          <span className={styles.livePostTitle}>My Post</span>
          <div
            style={{ paddingLeft: 30, paddingRight: 30 }}
            onClick={() => setShowList(!showList)}
          >
            Edit
          </div>
          {showList ? (
            <div>
              <Link href={`/events/edit/${postId}`}>Edit</Link>
              <div onClick={() => makePublic(!post?.is_public)}>
                Make public
              </div>
              <div onClick={deletePost}>Delete</div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className={styles.titleBlock}>
          <span className={styles.title}>title</span>
          <span className={styles.titleText}>{post.title}</span>
        </div>
        <div className={styles.categoryBlock}>
          <span className={styles.category}>Category</span>
          <div className={styles.categoryBtn}>
            <span className={styles.categoryBtnText}>{post.category}</span>
          </div>
        </div>
        <div className={styles.descriptionBlock}>
          <span className={styles.description}>Description</span>
          <p className={styles.descriptionText}>{post.description}</p>
        </div>
        <div
          className={styles.publicity}
          onClick={() => {
            isAuthor && makePublic(!post.is_public);
          }}
        >
          {post.is_public ? (
            <Image src="/decor/eye4.svg" alt="" width={32} height={27} />
          ) : (
            <Image src="/decor/eye5.svg" alt="" width={36} height={36} />
          )}
          <span
            className={
              post.is_public ? styles.currently : styles.currentlyActive
            }
          >
            This Post Is Currently
          </span>
          <span
            className={post.is_public ? styles.public : styles.publicActive}
          >
            {post.is_public ? "Public" : "Private"}
          </span>

          <Tooltip
            placement="top"
            title={"Maintenance technician at apartment building"}
          >
            <Image
              src="/decor/qwe.svg"
              alt=""
              width={36}
              height={36}
              className={styles.question}
            />
          </Tooltip>
        </div>
        {coordinates && coordinates.length === 2 ? (
          <div style={{ paddingBottom: 20 }}>
            Location
            <Map lat={Number(coordinates[0])} lng={Number(coordinates[1])} />
          </div>
        ) : (
          <></>
        )}
        <div className={styles.buttonBlock}>
          <Button className={styles.shareBtn}>
            <Image
              src="/decor/share.svg"
              alt=""
              width={16}
              height={16}
              className={styles.shareIcon}
            />
            <span className={styles.shareBtnText}>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
