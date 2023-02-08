import styles from "./LivePost.module.scss";
import Image from "next/image";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { useState, useMemo } from "react";
// import RememberBlock from "../../RememberBlock/RememberBlock";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import ThreadForm from "../../Posts/ThreadForm";
import { CovertStringCoordinates } from "../../../utils/covnverterForCoordinates";
import { useSession } from "next-auth/react";

type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  created_at: Date;
  category: string;
  description: string;
  is_public: boolean;
};
type PostProps = { appUrl: string; post: PostType };

export default function LivePost(props: PostProps) {
  const [open, setOpen] = useState(false);
  const [share, setShare] = useState<Boolean>();
  const [post, setPost] = useState<PostType>(props.post);
  const appUrl = props.appUrl;
  const { data: session } = useSession();
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

  return (
    <section className={styles.container}>
      <div className={styles.backBlock}>
        <Button
          className={styles.backButton}
          type="link"
          onClick={() => router.push(`${appUrl}/posts`)}
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
      <div className={styles.livePostContainer}>
        <div>
          <span className={styles.livePostTitle}>Live Post</span>
        </div>

        <div className={styles.titleBlock}>
          <span className={styles.title}>title</span>
          <span className={styles.titleText}>{post.title}</span>
        </div>
        <div className={styles.categoryBlock}>
          <span className={styles.category}>Category</span>
          <div className={styles.categoryButton}>
            <span className={styles.categoryButtonText}>{post.category}</span>
          </div>
        </div>
        <div className={styles.descriptionBlock}>
          <span className={styles.description}>Description</span>
          <p className={styles.descriptionText}>{post.description}</p>
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
        {/* */}

        <div className={styles.buttonBlock}>
          <ThreadForm
            appUrl={appUrl}
            postId={post.id}
            isThreadExists={false}
            threadId={""}
            isAuthor={false}
          />

          {/*
          <Button
            className={styles.shareBtn}
            onClick={() => {
              setShare(true);
              setOpen(true);
            }}
          >
            <Image
              src="/decor/share.svg"
              alt=""
              width={16}
              height={16}
              className={styles.shareIcon}
            />
            <span className={styles.shareBtnText}>Share</span>
          </Button>
          <Button
            className={styles.replyBtn}
            onClick={() => {
              setShare(false);
              setOpen(true);
            }}
          >
            <Image
              src="/decor/arrow2.svg"
              alt=""
              width={14}
              height={10}
              className={styles.reply}
            />
            <span className={styles.replyBtnText}>Reply </span>
          </Button>
          */}

          {/* <Modal></Modal> */}
{/* 
          <Modal
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={715}
            footer={null}
            className={styles.modal}
          >
            {share ? (
              <div className={styles.modalContainer}>
                <span className={styles.modalTitle}>Social Sharing</span>
              </div>
            ) : (
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
              </div>
            )}
          </Modal> */}
        </div>
      </div>
    </section>
  );
}
