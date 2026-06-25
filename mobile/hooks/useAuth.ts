import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.login(data),
    onSuccess: (response) => {
      setAuth({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      email: string;
      username: string;
      password: string;
      district: string;
    }) => api.register(data),
    onSuccess: (response) => {
      setAuth({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => api.forgotPassword(email),
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => api.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
