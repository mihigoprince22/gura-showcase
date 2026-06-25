import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

interface AuthTokens {
  token: string;
  refreshToken: string;
}

interface UserResponse {
  id: string;
  email: string;
  username: string;
  district: string;
}

interface LoginResponse extends AuthTokens {
  user: UserResponse;
}

interface RegisterResponse extends AuthTokens {
  user: UserResponse;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = false,
  } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401 && requiresAuth) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      const retryToken = useAuthStore.getState().token;
      requestHeaders["Authorization"] = `Bearer ${retryToken}`;
      const retryConfig: RequestInit = { ...config, headers: requestHeaders };
      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, retryConfig);
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message || `Request failed with status ${retryResponse.status}`
        );
      }
      return retryResponse.json() as Promise<ApiResponse<T>>;
    } else {
      useAuthStore.getState().logout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<ApiResponse<T>>;
}

async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = (await response.json()) as ApiResponse<AuthTokens>;
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.getState().setAuth({
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        user: currentUser,
      });
    }
    return true;
  } catch {
    return false;
  }
}

export const api = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    district: string;
  }) =>
    request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: data,
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
      requiresAuth: true,
    }),

  forgotPassword: (email: string) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),

  resetPassword: (data: { token: string; password: string }) =>
    request("/auth/reset-password", {
      method: "POST",
      body: data,
    }),

  getMe: () =>
    request<UserResponse>("/auth/me", {
      requiresAuth: true,
    }),

  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "GET", requiresAuth: true }),

  post: <T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "POST", body, requiresAuth: true }),

  put: <T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "PUT", body, requiresAuth: true }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "DELETE", requiresAuth: true }),
};

export default api;
