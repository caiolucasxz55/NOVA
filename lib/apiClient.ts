export async function apiClient(
  url: string,
  options: RequestInit = {}
) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Se o token expirou → status 401
  if (response.status === 401) {
    console.warn("Token expirado. Redirecionando para login...");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  // Tenta converter json, senão retorna vazio
  try {
    return await response.json();
  } catch {
    return null;
  }
}
