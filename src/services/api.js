const API_URL = import.meta.env.VITE_API_BASE_URL || "https://wheels-project-be.vercel.app/api/v1";

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  // ✅ Devuelve directamente el JSON
  const data = await response.json();
  return { ok: response.ok, data };
};


export const registerUser = (formData) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });
export const registerCar = (formData) =>
  fetch(`${API_URL}/car`, {
    method: "POST",
    body: formData,
  });
