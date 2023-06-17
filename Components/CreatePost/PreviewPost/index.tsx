import { Button, message } from "antd";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { Spiner } from "@/components/General/Spiner/Spiner";
import Location from "@/components/Location/Location";
import styles from "@/components/CreatePost/PreviewPost/PreviewPost.module.scss";
import { postStore } from "@/stores";

type PreviewPostProps = { appUrl: string };

export const PreviewPost = observer((props: PreviewPostProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const session = useSession();
  let appUrl = props.appUrl;

  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <Spiner />,
        ssr: false,
      }),
    []
  );

  const error = (text: string | { code: any; message: any }) => {
    messageApi.open({
      type: "error",
      content: typeof text === "string" ? text : text.message,
      duration: 2.5,
      style: {
        marginTop: "10vh",
      },
    });
  };

  const {
    category,
    city,
    description,
    isPublic,
    lat,
    lng,
    locationName,
    title,
    state,
    zip,
  } = postStore;

  if (
    !category ||
    !city ||
    !description ||
    !lat ||
    !lng ||
    !title ||
    !state ||
    !zip
  ) {
    return null;
  }

  async function onPublishClick() {
    try {
      const res = await axios.post(
        `${appUrl}/api/posts/create`,
        {
          category,
          city,
          description,
          is_public: isPublic,
          lat,
          lng,
          location_name: locationName,
          title,
          state,
          zip,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        router.push("/myPosts");
        postStore.clearParams();

        return true;
      }

      return true;
    } catch (e) {
      console.error(e);
      error("Произошла ошибка при публикации поста. Попробуйте позже.");
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.error}>{contextHolder}</div>
      <Link className={styles.backLink} href="/createPost">
        <Image
          src="/decor/arrow-left-1.svg"
          alt=""
          width={23}
          height={7}
          className={styles.backImage}
        />
      </Link>
      <div className={styles.previewPostContainer}>
        <div className={styles.previewPostInfo}>
          <div className={styles.previewPostTags}>
            <div className={styles.previewPostStar}>
              <Image
                src={"/decor/starNoFaiv.svg"}
                alt=""
                width={20}
                height={20}
                className={styles.starImage}
              />
            </div>
            <div className={styles.previewPostCategory}>{category}</div>
          </div>
          <h1 className={styles.previewPostTitle}>{title}</h1>
          <div className={styles.previewPostDescription}>{description}</div>
          <div className={styles.previewPostLocation}>
            <div>
              <Image
                src={"/decor/marker.svg"}
                alt=""
                width={14}
                height={20}
                className={styles.starImage}
              />
            </div>
            <Location post={{ city, location_name: locationName, state }} />
          </div>
          <div className={styles.previewPostButtons}>
            <Button
              className={styles.previewPostEdit}
              onClick={() => router.push("/createPost")}
            >
              Отредактировать
            </Button>
            <Button
              className={styles.previewPostPublish}
              onClick={onPublishClick}
            >
              Опубликовать
            </Button>
          </div>
        </div>
        <div className={styles.previewPostMap}>
          <Map
            appUrl={appUrl}
            userLat={Number(session?.data?.user?.lat)}
            userLng={Number(session?.data?.user?.lng)}
            lat={Number(lat)}
            lng={Number(lng)}
          />
        </div>
      </div>
    </section>
  );
});
