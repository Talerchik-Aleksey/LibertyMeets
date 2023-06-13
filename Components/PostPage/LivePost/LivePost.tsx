import Image from "next/image";
import { Button } from "antd";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import ThreadForm from "../../Posts/ThreadForm";
import { Session } from "next-auth";
import { Spiner } from "../../General/Spiner/Spiner";
import styles from "./LivePost.module.scss";
import Location from "../../Location/Location";
import { useSession } from "next-auth/react";
import { ExchangePostType, PostType } from "../../../types/general";
import axios from "axios";

type PostProps = {
  session: Session | null;
  appUrl: string;
  post: ExchangePostType;
};

export default function LivePost(props: PostProps) {
  const [post, setPost] = useState<PostType>(props.post as PostType);
  const session = useSession();
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

  async function changeStar(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);

    const is_favorite = res.data.data.isFavorite;

    setPost({ ...post, is_favorite });
  }

  return (
    <>
      <section className={styles.container}>
        <Button
          className={styles.backButton}
          type="link"
          onClick={() => history.back()}
        >
          <Image
            src="/decor/arrow-left-1.svg"
            alt=""
            width={23}
            height={7}
            className={styles.backImage}
          />
        </Button>
        <div className={styles.livePostContainer}>
          <div className={styles.livePostInfo}>
            <div className={styles.livePostTags}>
              {session.status === "authenticated" && (
                <div className={styles.livePostStar}>
                  {
                    <div
                      onClick={() => {
                        changeStar(post.id);
                      }}
                    >
                      <Image
                        src={
                          post.favoriteUsers?.length > 0 || post.is_favorite
                            ? "/decor/starFaiv.svg"
                            : "/decor/starNoFaiv.svg"
                        }
                        alt=""
                        width={20}
                        height={20}
                        className={styles.starImage}
                      />
                    </div>
                  }
                </div>
              )}
              <div className={styles.livePostCategory}>{post.category}</div>
            </div>
            <div className={styles.livePostTitle}>{post.title}</div>
            <div className={styles.livePostDescription}>{post.description}</div>
            <div className={styles.livePostLocation}>
              <div>
                <Image
                  src={"/decor/marker.svg"}
                  alt=""
                  width={14}
                  height={20}
                  className={styles.starImage}
                />
              </div>
              {coordinates && coordinates.length === 2 ? (
                <Location post={post} />
              ) : (
                <></>
              )}
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
          </div>
          <div className={styles.livePostMap}>
            {coordinates && coordinates.length === 2 ? (
              <Map
                appUrl={appUrl}
                userLat={props.session?.user.lat}
                userLng={props.session?.user.lng}
                lat={Number(coordinates[0])}
                lng={Number(coordinates[1])}
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
    </>
  );
}
