"use client";

import { useEffect, useState } from "react";
import { NumberNeighbor } from "@/components/blocks";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: false,
  });

  console.log(data);

  return (
    <div>
      <NumberNeighbor roles={data?.data.roles} />
    </div>
  );
}
