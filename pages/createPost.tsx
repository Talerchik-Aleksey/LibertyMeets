import styles from "../styles/posts.module.css";
import Image from "next/image";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";

type propsType = { appUrl: string };

export default function CreatePost({ appUrl }: propsType) {
  // const state = {
  //   address: "",

  //   showingInfoWindow: false,
  //   activeMarker: {},
  //   selectedPlace: {},

  //   mapCenter: {
  //     lat: 49.2827291,
  //     lng: -123.1207375,
  //   },
  // };
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      description: "",
      isPublic: true,
    },
    onSubmit: async (values) => {
      console.log(`${appUrl}/api/posts/create`);
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
            <option value="camping">Camping</option>
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
          {/* <Map
            style={{ width: "842px", height: "460px" }}
            google={props.google}
            initialCenter={{
              lat: state.mapCenter.lat,
              lng: state.mapCenter.lng,
            }}
            center={{
              lat: state.mapCenter.lat,
              lng: state.mapCenter.lng,
            }}
          >
            <Marker
              mapCenter={{
                lat: state.mapCenter.lat,
                lng: state.mapCenter.lng,
              }}
            />
          </Map> */}
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
