import styles from "./MyPost.module.scss";
import Image from "next/image";
import { Button, Select, Tooltip } from "antd";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { CovertStringCoordinates } from "../../../utils/covnverterForCoordinates";
const { Option } = Select;

type PostProps = { appUrl: string; post: PostType; fromUrl: string };
type ErrorResponse = {
  status: string;
};
type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  created_at: Date;
  category: string;
  description: string;
  is_public: boolean;
  is_blocked: boolean;
};

const availableFromUrl = ["posts", "myPosts"];

export default function MyPost(props: PostProps) {
  const [post, setPost] = useState<PostType>(props.post);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data: session } = useSession();
  let appUrl = props.appUrl;
  if (props.fromUrl in availableFromUrl) {
    appUrl = "/posts";
  }
  const fromUrl = props.fromUrl;

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

  const coordinates = CovertStringCoordinates(post.geo);

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
    <section className={styles.container}>
      <div className={styles.backBlock}>
        <Button
          className={styles.backButton}
          type="link"
          onClick={() => router.push(`${appUrl}/${fromUrl}`)}
        >
          <Image
            src="/decor/arrow-left.svg"
            alt=""
            width={45}
            height={42}
            className={styles.backImage}
          />
          <span className={styles.backButtonText}>Back</span>
        </Button>
      </div>
      <div className={styles.myPostContainer}>
        {post.is_blocked && (
          <div className={styles.blockedPost}>
            <div className={styles.blockedWrapper}>
              <Image src="/decor/remember.svg" alt="" width={45} height={41} />
              <span className={styles.blockedTitle}>
                This post blocked by admin!
              </span>
            </div>
          </div>
        )}
        <div className={styles.topBlock}>
          <span className={styles.myPostTitle}>My Post</span>
          <Select
            value={"Edit"}
            style={{
              width: "20%",
            }}
            showArrow={false}
            placement={"bottomLeft"}
            className={styles.select}
            bordered={false}
          >
            <Option className={styles.optionContainer} key="edit">
              <Link href={`/posts/edit/${postId}/?fromUrl=${fromUrl}`}>
                <div className={styles.option}>
                  <Image
                    src="/decor/editPensil.svg"
                    alt=""
                    width={14}
                    height={14}
                    className={styles.edit}
                  />
                  Edit
                </div>
              </Link>
            </Option>
            <Option className={styles.optionContainer} key="public">
              <div
                className={styles.option}
                onClick={() => makePublic(!post?.is_public)}
              >
                <Image
                  src="/decor/eye3.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.eye}
                />
                Make Post {post.is_public ? "Private" : "Public"}
              </div>
            </Option>
            <Option className={styles.optionContainer} key="delete">
              <div className={styles.option} onClick={deletePost}>
                <Image
                  src="/decor/trash.svg"
                  alt=""
                  width={14}
                  height={16}
                  className={styles.delete}
                />
                Delete
              </div>
            </Option>
          </Select>
        </div>

        <div className={styles.titleBlock}>
          <span className={styles.title}>title</span>
          <div className={styles.titleText}>{post.title}</div>
        </div>
        <div className={styles.categoryBlock}>
          <span className={styles.category}>Category</span>
          <div className={styles.categoryButton}>
            <div className={styles.categoryButtonText}>{post.category}</div>
          </div>
        </div>
        <div className={styles.descriptionBlock}>
          <span className={styles.description}>Description</span>
          <p className={styles.descriptionText}>{post.description}</p>
        </div>
        <div className={styles.publicity}>
          <div
            onClick={() => {
              isAuthor && makePublic(!post.is_public);
            }}
          >
            {post.is_public ? (
              <Image
                src="/decor/eye5.svg"
                alt=""
                width={36}
                height={36}
                className={styles.publicityImage}
              />
            ) : (
              <Image
                src="/decor/eye4.svg"
                alt=""
                width={36}
                height={36}
                className={styles.publicityImage}
              />
            )}
          </div>
          <span
            className={
              post.is_public ? styles.currentlyActive : styles.currently
            }
          >
            This Post Is Currently
          </span>
          <span
            className={post.is_public ? styles.publicActive : styles.public}
          >
            {post.is_public ? "Public" : "Private"}
          </span>

          <Tooltip
            trigger={"hover"}
            title={
              "Setting this post to public lets users that are not asigned in see this post."
            }
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
        <div className={styles.cardBlock}>
          {coordinates && coordinates.length === 2 ? (
            <>
              <span className={styles.location}>location</span>
              <Map
                appUrl={appUrl}
                userLat={session?.user.lat}
                userLng={session?.user.lng}
                lat={Number(coordinates[0])}
                lng={Number(coordinates[1])}
                isAllowClick={false}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
}
