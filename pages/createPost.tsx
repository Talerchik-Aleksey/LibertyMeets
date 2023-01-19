import styles from "../styles/posts.module.css";
import Image from "next/image";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { KEY_LAT, KEY_LNG, DEFAULT_LAT, DEFAULT_LNG } from "../constants/constants";

type PropsType = { appUrl: string };

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export default function CreatePost({ appUrl }: PropsType) {
  const { data: session } = useSession();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Components/Map"), {
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
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, [session]);

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      description: "",
      isPublic: true,
      lat: DEFAULT_LAT,
      lng: DEFAULT_LNG
    },
    onSubmit: async (values) => {
      values.lat = lat;
      values.lng = lng;
      const req = await axios.post(`${appUrl}/api/posts/create`, values, {
        withCredentials: true,
      });
      if (req.status === 200) {
        alert(req.data.data.postId);
        router.push("/myPosts");
      } else {
        alert();
      }
    },
  });

  return (
    <div className="defaultPage">
      <form className={styles.block} onSubmit={formik.handleSubmit}>
        <div>Create Post</div>
        <div>
          <input
            name="title"
            placeholder="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          <input
            name="description"
            placeholder="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          <select
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
          >
            <option value="social">Social</option>
            <option value="volunteer">Volunteer</option>
            <option value="professional">Proffesional</option>
            <option value="campaigns">Сampaigns</option>
          </select>
          <input
            name="isPublic"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.isPublic}
          />
        </div>
        <div>
          Location
          <Map lat={lat} lng={lng} />
        </div>
        <div>
          <button>Cancel</button>
          <button type="submit">Preview Post</button>
        </div>
        <div className={styles.warningBox}>
          <Image
            src="/decor/Warning.svg"
            alt="Warning"
            width={45.5}
            height={41.76}
          />
          <div className={styles.remember}>Remember!</div>
          "Please do not give time/location details or personal identifying
          information in the post title or description. And if you are meeting
          with strangers, please do so in a public place."
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
