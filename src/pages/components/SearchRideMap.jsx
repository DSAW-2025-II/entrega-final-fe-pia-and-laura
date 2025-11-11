import { useState, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

export default function SearchRideMap({ selectedLocation, onMapClick }) {
  const [viewState, setViewState] = useState({
    longitude: -74.0325,
    latitude: 4.8616,
    zoom: 14,
  });

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  useEffect(() => {
    if (selectedLocation) {
      setViewState((prev) => ({
        ...prev,
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        zoom: 15,
      }));
    }
  }, [selectedLocation]);
  const handleClick = (e) => {
    const { lng, lat } = e.lngLat;
    if (onMapClick) {
      onMapClick({ longitude: lng, latitude: lat });
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Marcador por defecto */}
        <Marker longitude={-74.0325} latitude={4.8616} color="#1F2937" />

        {/* Marcador del usuario */}
        {selectedLocation && (
          <Marker
            longitude={selectedLocation.longitude}
            latitude={selectedLocation.latitude}
            color="#2563eb"
          />
        )}

        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
