import Image from "next/image";
import { Button, Form, Input, Select, Switch } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";
import RememberBlock from "../RememberBlock/RememberBlock";
import { KEY_LAT, KEY_LNG } from "../../constants/constants";
import styles from "./CreatePost.module.scss";
import Link from "next/link";

const { TextArea } = Input;
const geoLocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

type CreatePostProps = { appUrl: string };

export default function CreatePost(props: CreatePostProps) {
  const { appUrl } = props;
  const { data: session } = useSession();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  function success(position: {
    coords: { latitude: number; longitude: number };
  }) {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
    localStorage.setItem(KEY_LAT, position.coords.latitude.toString());
    localStorage.setItem(KEY_LNG, position.coords.longitude.toString());
  }

  function error(err: { code: any; message: any }) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    let lat;
    let lng;
    let lsLat;
    let lsLng;
    if (session) {
      lat = session.user.lat;
      lng = session.user.lng;
      if (lat) setLat(lat);
      if (lng) setLng(lng);
      if (lat && lng) {
        localStorage.setItem(KEY_LAT, lat.toString());
        localStorage.setItem(KEY_LNG, lng.toString());
        return;
      }
    }
    if (!lat || !lng) {
      lsLat = localStorage.getItem(KEY_LAT);
      lsLng = localStorage.getItem(KEY_LNG);
      if (lsLat) setLat(+lsLat);
      if (lsLng) setLng(+lsLng);
      if (lsLat && lsLng) {
        return;
      }
    }
    navigator.geolocation.getCurrentPosition(
      success,
      error,
      geoLocationOptions
    );
  }, [session]);

  const router = useRouter();
  async function onFinish(values: any) {
    try {
      values.lat = lat;
      values.lng = lng;
      values.is_public = isPublic;
      const req = await axios.post(`${appUrl}/api/posts/create`, values, {
        withCredentials: true,
      });

      if (req.status === 200) {
        router.push("/myPosts");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.arrow}>
        <Link className={styles.backLink} href={""}>
          <Button
            className={styles.arrowBtn}
            type="link"
            onClick={() => router.push("/posts")}
          >
            <Image
              src="/decor/arrow-left.svg"
              alt=""
              width={45}
              height={42}
              className={styles.vector}
            />
            <span className={styles.backBtn}>Back</span>
          </Button>
        </Link>
      </div>
      <div className={styles.createContainer}>
        <Form
          name="normal_login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <div className={styles.title}>Create Post</div>
          <div className={styles.inputContainer}>
            <div className={styles.postTitle}>
              <Form.Item
                className={styles.postTitleText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Post Title"
                name="title"
                colon={false}
                rules={[
                  { required: true },
                  { type: "string", min: 4, max: 100 },
                ]}
              >
                <Input
                  suffix={
                    <Image
                      src="/decor/editPensil.svg"
                      alt=""
                      width={18}
                      height={30}
                    />
                  }
                  className={styles.postTitleInput}
                />
              </Form.Item>
            </div>
            <div className={styles.category}>
              <Form.Item
                className={styles.categoryText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Category"
                name="category"
                initialValue="social"
                colon={false}
                rules={[{ required: true }]}
              >
                <Select className={styles.categorySelect}>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="social"
                  >
                    Social
                  </Select.Option>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="volunteer"
                  >
                    Volunteer
                  </Select.Option>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="professional"
                  >
                    Professional
                  </Select.Option>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="campaigns"
                  >
                    Сampaigns
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className={styles.description}>
              <Form.Item
                className={styles.descriptionText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Description"
                name="description"
                colon={false}
                rules={[
                  { required: true },
                  { type: "string", min: 4, max: 200 },
                ]}
              >
                <TextArea
                  maxLength={200}
                  autoSize={{ minRows: 7, maxRows: 7 }}
                  showCount={true}
                  rows={7}
                  size={"small"}
                  className={styles.descriptionTextarea}
                />
              </Form.Item>
            </div>
          </div>
          <div className={styles.public}>
            <Switch
              className={styles.switch}
              onChange={() => setIsPublic(!isPublic)}
            />
            <span>Set To {isPublic ? "Public" : "Private"}?</span>
            <Image src="/decor/qwe.svg" alt="" width={26} height={26} />
          </div>
          <div className={styles.location}>
            <span>* Location</span>
            <div className={styles.map}>
              <Map
                lat={lat}
                lng={lng}
                setLat={setLat}
                setLng={setLng}
                isAllowClick={true}
              />
            </div>
          </div>
          <div className={styles.buttonBlock}>
            <Button
              className={styles.cancel}
              onClick={() => router.push("/posts")}
            >
              <Image src="/decor/x.svg" alt="" width={10} height={10} />
              <span className={styles.cancelBtn}>Cancel</span>
            </Button>
            <Form.Item>
              <Button className={styles.preview} htmlType="submit">
                {/* <Image src="/decor/eyes.svg" alt="" width={16} height={14} /> */}
                <span className={styles.previewBtn}>Create Post</span>
              </Button>
            </Form.Item>
          </div>
          <div className={styles.remember}>
            <RememberBlock />
          </div>
        </Form>
      </div>
    </section>
  );
}
