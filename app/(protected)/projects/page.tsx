"use client";

import { useEffect, useState } from "react";
import { NumberNeighbor } from "@/components/blocks";

export default function ProjectsPage() {
  // useEffect(() => {
  //   const getSmth = async () => {
  //     const res = await api.get("/auth/protected", {
  //       withCredentials: true,
  //     });
  //
  //     console.log(res);
  //   };
  //
  //   getSmth().catch((e) => console.log("PAGE ERROR", e));
  // }, []);

  return (
    <div>
      <NumberNeighbor />
    </div>
  );
}
