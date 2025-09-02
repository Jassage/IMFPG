// src/hooks/useAuthUser.ts
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/userStore";

export const useAuthUser = () => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserInfo({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      setUserInfo(null);
    }
  }, [user, isAuthenticated]);

  return { userInfo, isAuthenticated, loading };
};
