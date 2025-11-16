import { useState, useEffect } from "react";

export default function AutocompleteInput({ label, name, value, onChange }) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&bbox=-75.0445,3.7135,-73.2520,5.5050`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("Error fetching Mapbox:", err);
      }
      setLoading(false);
    };

    const timeout = setTimeout(fetchPlaces, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.place_name);
    setSuggestions([]);

    onChange({
        target: { 
        name,
        value: place.place_name,
        coords: place.center  
  }
});
  };

  return (
    <div className="relative">
      <label className="block font-bold text-gray-700">{label}</label>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0]"
        placeholder="Enter a direction for better results..."
      />

      {loading && <p className="text-sm text-gray-500">Searching...</p>}

      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full rounded-xl mt-1 shadow-lg z-20 max-h-60 overflow-y-auto">
          {suggestions.map((place) => (
            <li
              key={place.id}
              className="p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
