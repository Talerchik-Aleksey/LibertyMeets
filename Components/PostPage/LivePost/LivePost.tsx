import Image from "next/image";
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import ThreadForm from "../../Posts/ThreadForm";
import { Session } from "next-auth";
import styles from "./LivePost.module.scss";

type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  created_at: Date;
  category: string;
  description: string;
  is_public: boolean;
  lat: number;
  lng: number;
};
type PostProps = { session: Session | null; appUrl: string; post: PostType };

export default function LivePost(props: PostProps) {
  const [post, setPost] = useState<PostType>(props.post);
  const appUrl = props.appUrl;

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const Map = useMemo(
    () =>
      dynamic(() => import("../../Map"), {
        loading: () => (
          <Spin indicator={antIcon} style={{ margin: "auto auto" }} />
        ),
        ssr: false,
      }),
    []
  );

  if (!post) {
    return null;
  }

  const coordinates = [post.lat, post.lng];

  return (
    <section className={styles.container}>
      <div className={styles.backBlock}>
        <Button
          className={styles.backButton}
          type="link"
          onClick={() => history.back()}
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
          <span className={styles.livePostTitle}>{post.title}</span>
        </div>
        <div className={styles.categoryBlock}>
          <div className={styles.categoryButton}>
            <span className={styles.categoryButtonText}>{post.category}</span>
          </div>
        </div>

        <div className={styles.postContent}>
          <div className={styles.descriptionBlock}>
            <p className={styles.descriptionText}>{post.description}</p>
          </div>
          <div className={styles.cardBlock}>
            {coordinates && coordinates.length === 2 ? (
              <>
                <Map
                  appUrl={appUrl}
                  userLat={props.session?.user.lat}
                  userLng={props.session?.user.lng}
                  lat={Number(coordinates[0])}
                  lng={Number(coordinates[1])}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={styles.buttonBlock}>
          {props.session?.user ? (
            <ThreadForm
              appUrl={appUrl}
              postId={post.id}
              isThreadExists={false}
              threadId={""}
            />
          ) : (
            <></>
          )}
        </div>
        {/* */}

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
    </section>
  );
}
