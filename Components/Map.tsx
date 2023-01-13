import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const center = {
  lat: 51.505,
  lng: -0.09,
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

  return position === null ? null : (
    <Marker position={position}>
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
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 460, width: 842 }}
    >
      <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker lat={lat} lng={lng} />
    </MapContainer>
  );
}
