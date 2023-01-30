import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { DEFAULT_LAT, DEFAULT_LNG } from "../constants/constants";
import styles from './Map.module.scss';
import Image from "next/image";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const center = {
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
};

type MapProps = {
  lat: number;
  lng: number;
};

function LocationMarker(props: MapProps) {
  const { lat, lng } = props;
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
  }>(center);

  const map = useMapEvents({
    click() {
      map.locate();
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

  const icon = L.icon({ iconUrl: "/decor/marker.png" });
  
// TODO Customize popup
  return position === null ? null : (
    <Marker position={position} icon={icon}>
      
      <Popup>
        
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  );
}

export default function Map(props: MapProps) {
  const { lat, lng } = props;

  return (
    <MapContainer
      center={[DEFAULT_LAT, DEFAULT_LNG]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 460, width: 842 }}
      className={styles.mapContainer}
    >
      
      <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker lat={lat} lng={lng}></LocationMarker>
    </MapContainer>
  );
}
