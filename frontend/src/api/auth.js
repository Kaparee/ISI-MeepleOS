const API_BASE_URL = "http://127.0.0.1:8000/api/v1/auth";

/**
 * Extract readable error message from FastAPI JSON responses (string or 422 validation list).
 */
function parseErrorMessage(data, fallback) {
  if (!data || !data.detail) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((err) => {
        const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : "";
        return field ? `${field}: ${err.msg}` : err.msg;
      })
      .join(" | ");
  }
  return fallback;
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(parseErrorMessage(data, `Błąd HTTP ${response.status}`));
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function registerUser(formData) {
  const payload = {
    email: formData.email.trim(),
    password: formData.password,
    nickname: formData.nickname?.trim() || null,
    name: formData.name?.trim() || null,
    surname: formData.surname?.trim() || null,
    phone_number: formData.phone_number?.trim() || null,
  };

  return request("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(credential, password) {
  return request("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: credential.trim(), password }),
  });
}

export async function fetchCurrentUser(token) {
  return request("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}
