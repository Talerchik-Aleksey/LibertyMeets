import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { DEFAULT_LAT, DEFAULT_LNG } from "../constants/constants";
import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const center = {
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
};

type MapProps = {
  lat: number;
  lng: number;
  setLat?: React.Dispatch<React.SetStateAction<number>>;
  setLng?: React.Dispatch<React.SetStateAction<number>>;
  isAllowClick: boolean;
};

function LocationMarker(props: MapProps) {
  const { lat, lng, setLat, setLng, isAllowClick } = props;
  const [position, setPosition] = useState({
    lat: center.lat,
    lng: center.lng,
  });
  const markerRef = useRef<any>(null);

  const map = useMapEvents({
    load() {
      map.locate();
    },
    click(e: any) {
      if (isAllowClick === false || !setLng || !setLat) {
        return;
      }
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLng(lng);
      setPosition(e.latlng);
    },
    locationfound(e: any) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (lat && lng) {
      const position = {
        lat,
        lng,
      };
      setPosition(position);
      map.flyTo(position, map.getZoom());
    }
  }, [lat, lng, map]);

  const icon = L.icon({
    iconUrl: "/decor/marker.png",
    iconAnchor: [64 / 2, 64],
  });

  return position === null ? null : (
    <Marker position={position} ref={markerRef} icon={icon} />
  );
}

export default function Map(props: MapProps) {
  const { lat, lng, setLat, setLng, isAllowClick } = props;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: 460, width: 842 }}
      className={styles.mapContainer}
    >
      <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        lat={lat}
        lng={lng}
        setLat={setLat}
        setLng={setLng}
        isAllowClick={isAllowClick}
      />
    </MapContainer>
  );
}
