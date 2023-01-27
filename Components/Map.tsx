import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo, useRef } from "react";
import { DEFAULT_LAT, DEFAULT_LNG } from "../constants/constants";

const center = {
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
};

type MapProps = {
  lat: number;
  lng: number;
  setLat: React.Dispatch<React.SetStateAction<number>>;
  setLng: React.Dispatch<React.SetStateAction<number>>;
};

function LocationMarker(props: MapProps) {
  const { lat, lng, setLat, setLng } = props;
  const [position, setPosition] = useState({
    lat: center.lat,
    lng: center.lng,
  });
  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPosition = marker.getLatLng();
          setPosition((currentPosition) => {
            setLat(newPosition.lat);
            setLng(newPosition.lng);
            return newPosition;
          });
        }
      },
    }),
    []
  );

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
  // TODO Customize popup
  return position === null ? null : (
    <Marker
      draggable={true}
      position={position}
      eventHandlers={eventHandlers}
      ref={markerRef}
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  );
}

export default function Map(props: MapProps) {
  const { lat, lng, setLat, setLng } = props;

  return (
    <MapContainer
      center={[DEFAULT_LAT, DEFAULT_LNG]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 460, width: 842 }}
    >
      <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
    </MapContainer>
  );
}
