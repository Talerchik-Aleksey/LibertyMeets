import styles from "./LivePost.module.scss";
import Image from "next/image";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { useState } from "react";
import RememberBlock from "../../RememberBlock/RememberBlock";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

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

export default function LivePost(props: PostProps) {
  const [editPost, setEditPost] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [post, setPost] = useState<PostType>(props.post);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data: session } = useSession();
  const appUrl = props.appUrl;
  const router = useRouter();

  if (!post) {
    return null;
  }

  const postId = post.id;

  const isAuthor = session ? post?.author_id === session?.user.id : undefined;
  const canEditPost = isAuthor;

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

  return (
    <div className={styles.container}>
      <div className={styles.arrow}>
        <Button className={styles.arrowBtn} type="link">
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
          <span className={styles.livePostTitle}>
            {isAuthor ? "My Post" : "Live Post"}
          </span>
          {canEditPost ? (
            <>
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
            </>
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
        <div className={styles.publicity}>
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
        <div className={styles.card}>
          <span className={styles.location}>location</span>
          <div className={styles.cardContainer}>
            <Image
              src="/decor/Map.svg"
              alt=""
              width={856}
              height={460}
              className={styles.cardImage}
            />
          </div>
        </div>
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
          {!isAuthor && (
            <Button className={styles.replyBtn} onClick={() => setOpen(true)}>
              <Image
                src="/decor/arrow2.svg"
                alt=""
                width={14}
                height={10}
                className={styles.reply}
              />
              <span className={styles.replyBtnText}>Reply </span>
            </Button>
          )}

          <Modal
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={715}
            footer={null}
            className={styles.modal}
          >
            <div className={styles.modalContainer}>
              <span className={styles.modalTitle}>Reply by Email</span>
              <Form.Item
                name={["user", "email"]}
                label="* Email Client"
                rules={[{ type: "email" }]}
                className={styles.emailItem}
              >
                <Input placeholder={"G-mail"} />
              </Form.Item>
              <span className={styles.adress}>
                Or copy and paste posters address into your email:
                <br />
                <strong>e570bd5f166a3@libertymeets.com </strong>
              </span>
              <Button className={styles.copyBtn}>Copy</Button>
              <RememberBlock />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
