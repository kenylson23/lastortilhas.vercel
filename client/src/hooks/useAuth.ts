import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export function useAuth() {
  const { data: user, isLoading, error, isError } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 15 * 60 * 1000, // 15 minutes - increase cache time
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  });

  // Quick resolution - don't wait indefinitely
  const authLoading = isLoading && !isError && !user;

  return {
    user,
    isLoading: authLoading,
    isAuthenticated: !!user,
    error,
  };
}
