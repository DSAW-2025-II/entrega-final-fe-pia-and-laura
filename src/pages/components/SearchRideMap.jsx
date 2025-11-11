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
      }));
    }
  }, [selectedLocation]);
  const handleClick = async (e) => {
    const { lng, lat } = e.lngLat;

    // Llamar API de Mapbox para obtener dirección (reverse geocoding)
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=es&country=CO`
      );
      const data = await res.json();
      const place = data.features?.[0];

      if (place) {
        onMapClick({
          name: place.place_name,
          longitude: lng,
          latitude: lat,
        });
      } else {
        onMapClick({
          name: `(${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          longitude: lng,
          latitude: lat,
        });
      }
    } catch (err) {
      console.error("Error al obtener dirección:", err);
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
