import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import styles from "../styles/posts.module.css";
import Image from "next/image";

function CreatePost(props: any) {
  const state = {
    address: "",

    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},

    mapCenter: {
      lat: 49.2827291,
      lng: -123.1207375,
    },
  };

  return (
    <div className="defaultPage">
      <div className={styles.block}>
        <div>Create Post</div>
        <div>Post Title</div>
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
            <button>Preview Post</button>
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
      </div>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBLVHqBpK4pTUHkxRLctTj6a3nHrt1d-uI",
})(CreatePost);
