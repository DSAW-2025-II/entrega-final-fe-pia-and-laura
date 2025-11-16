export const normalizeLocation = async (coords) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?types=address,neighborhood,locality,place,region&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data.features || data.features.length === 0) return null;

  const f = data.features[0];
  const ctx = f.context || [];

  // 0️⃣ Validar que está en Cundinamarca
  const region = ctx.find((c) => c.id.includes("region"));
  if (!region || region.text !== "Cundinamarca") return null;

  // 1️⃣ Barrio
  const neighborhood = ctx.find((c) => c.id.includes("neighborhood"));
  if (neighborhood) return neighborhood.text;

  // 2️⃣ Localidad
  const locality = ctx.find((c) => c.id.includes("locality"));
  if (locality) return locality.text;

  // 3️⃣ Dirección corta (vía)
  if (f.place_type.includes("address")) return f.text;

  // 4️⃣ Ciudad
  const city = ctx.find((c) => c.id.includes("place"));
  if (city) return city.text;

  return f.text;
};
