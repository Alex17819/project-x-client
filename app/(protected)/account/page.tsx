"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ProjectsApi } from "@/api/projects";

export default function AccountPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: projectsResponse, isLoading: projectsLoading } = useQuery({
    queryKey: ["PROJECTS_GET"],
    queryFn: async () => {
      const response = await ProjectsApi.getProjects();
      return response.data;
    },
  });

  if (!data || isLoading || projectsLoading) return <div>Loading...</div>;

  const logout = async () => {
    await api.post("/auth/logout");
    queryClient.removeQueries({
      queryKey: ["USER_GET"],
    });
    router.replace("/login");
    await refetch();
  };

  const shareProject = async () => {
    const response = await ProjectsApi.shareProject(projectId, userId);
  };

  return (
    <div className="mt-2 flex justify-between">
      <div>
        Your id: {data?.data.id}
        <div className="space-x-2">
          <span>Share a project with another user:</span>
          <select
            className="border outline-none px-2"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projectsResponse?.map(({ id }) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <Input
            placeholder="Enter user's id"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
          />
        </div>
        <Button onClick={shareProject}>Send</Button>
      </div>

      <Button onClick={logout} className="float-right">
        Logout
      </Button>
    </div>
  );
}
