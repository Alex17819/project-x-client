"use client";

import { useEffect, useState } from "react";

import { api } from "@/api/axios";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSmth = async () => {
      const res = await api.get("/auth/protected", {
        withCredentials: true,
      });

      setIsLoading(false);

      console.log(res);
    };

    getSmth().catch((e) => console.log("PAGE ERROR", e));
  }, []);

  return isLoading ? (
    <div className="size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <>
      <h2>Protected route</h2>
    </>
  );
}
