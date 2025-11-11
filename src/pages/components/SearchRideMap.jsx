import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

export default function SearchRideMap() {
  const [viewState, setViewState] = useState({
    longitude: -74.0325,
    latitude: 4.8616,
    zoom: 14,
  });

  // Guarda el token explícitamente en una constante
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  console.log("TOKEN MAPBOX:", MAPBOX_TOKEN);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker longitude={-74.0325} latitude={4.8616} color="#1F2937" />
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
