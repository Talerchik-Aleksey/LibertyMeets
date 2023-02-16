import Image from "next/image";
import { Button, Tooltip } from "antd";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import ThreadForm from "../../Posts/ThreadForm";
import { Session } from "next-auth";
import { Spiner } from "../../General/Spiner/Spiner";
import styles from "./LivePost.module.scss";
import Location from "../../Location/Location";
import { Posts } from "../../../models/posts";

type PostType = Posts ;
type PostProps = { session: Session | null; appUrl: string; post: PostType };

export default function LivePost(props: PostProps) {
  const [post, setPost] = useState<PostType>(props.post);
  const appUrl = props.appUrl;

  const Map = useMemo(
    () =>
      dynamic(() => import("../../Map"), {
        loading: () => <Spiner />,
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
        <div className={styles.postHeader}>
          <div className={(styles.categoryBlock, styles.left)}>
            <div className={styles.categoryButton}>
              <span className={styles.categoryButtonText}>{post.category}</span>
            </div>
          </div>
          <div>
            <span className={styles.livePostTitle}>{post.title}</span>
          </div>
          <div className={styles.right}></div>
        </div>

        <div className={styles.postContent}>
          <div className={styles.descriptionBlock}>
            <p className={styles.descriptionText}>{post.description}</p>
          </div>
          <div className={styles.cardBlock}>
            {coordinates && coordinates.length === 2 ? (
              <>
              <Location post={post}/>
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
