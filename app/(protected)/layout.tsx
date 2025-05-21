"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!user?.data) {
      console.log("REDIRECT LOGIN");
      router.replace("/login");
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
