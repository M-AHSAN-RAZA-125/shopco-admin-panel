// Admin API Client for Shop.Co
const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://shopco-backend-theta.vercel.app");

export const API_BASE_URL = (() => {
  try {
    const url = new URL(configuredApiUrl, window.location.origin);
    const segments = url.pathname.split("/").filter(Boolean);
    while (["api", "products", "admin"].includes(segments.at(-1)?.toLowerCase())) {
      segments.pop();
    }
    url.pathname = `/${[...segments, "api"].join("/")}`;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "http://localhost:5000/api";
  }
})();

const TOKEN_KEY = "shopco_admin_token";

export const getAdminToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAdminToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage issues */
  }
};

export const removeAdminToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export const getAdminImageUrl = (image) => {
  const imagePath = typeof image === "string" ? image : image?.url || image?.path;
  if (!imagePath) return "https://placehold.co/80";
  if (imagePath.startsWith("data:") || imagePath.startsWith("blob:")) return imagePath;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;

  try {
    const apiOrigin = new URL(API_BASE_URL, window.location.origin).origin;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${apiOrigin}${cleanPath}`;
  } catch {
    return imagePath;
  }
};

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    throw new Error(
      `Backend Server offline! Please start backend on http://localhost:5000 (run "npm start" in the backend folder).`
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const adminApi = {
  // Auth
  async login(email, password) {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      setAdminToken(res.token);
    }
    return res;
  },

  async getMe() {
    return await apiRequest("/auth/me");
  },

  // Stats / Dashboard
  async getStats() {
    return await apiRequest("/admin/stats");
  },

  // Upload Image
  async uploadImage(imageData, filename = "image.png") {
    return await apiRequest("/upload", {
      method: "POST",
      body: JSON.stringify({ image: imageData, name: filename }),
    });
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category && params.category !== "All") query.set("category", params.category);
    query.set("limit", params.limit || 100);
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await apiRequest(`/products${queryString}`);
  },

  async createProduct(productData) {
    return await apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id, productData) {
    return await apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id) {
    return await apiRequest(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // Orders
  async getOrders() {
    return await apiRequest("/orders");
  },

  async updateOrderStatus(id, status) {
    return await apiRequest(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Users
  async getUsers() {
    return await apiRequest("/admin/users");
  },

  async updateUser(id, userData) {
    return await apiRequest(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id) {
    return await apiRequest(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },
};
