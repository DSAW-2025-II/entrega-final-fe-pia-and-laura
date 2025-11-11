import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

export default function SearchRideMap() {
  const [viewState, setViewState] = useState({
    longitude: -74.0325, // Chía, Universidad de La Sabana
    latitude: 4.8616,
    zoom: 14,
  });
    console.log("TOKEN:", import.meta.env.VITE_MAPBOX_TOKEN);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Marcador principal */}
        <Marker longitude={-74.0325} latitude={4.8616} color="#1F2937" />

        {/* Controles (zoom, rotación, etc.) */}
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
