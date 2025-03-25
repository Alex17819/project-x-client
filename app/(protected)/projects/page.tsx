"use client";

import { api } from "@/api/axios";
import { useEffect } from "react";

export default function ProjectsPage() {
  useEffect(() => {
    const getSmth = async () => {
      const res = await api.get("/auth/protected", {
        withCredentials: true,
      });

      console.log(res);
    };

    getSmth().catch((e) => console.log("PAGE ERROR", e));
  }, []);

  return <h1>Projects page</h1>;
}
