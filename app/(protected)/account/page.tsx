"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ProjectsApi } from "@/api/projects";
import { UserRoles } from "@/types/user";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks";

export default function AccountPage() {
  const queryClient = useQueryClient();
  const isAuth = useAuth();

  const [projectId, setProjectId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 0,
    enabled: isAuth === true,
  });

  const { data: projectsResponse, isLoading: projectsLoading } = useQuery({
    queryKey: ["PROJECTS_GET"],
    queryFn: async () => {
      const response = await ProjectsApi.getProjects();
      return response.data;
    },
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["USER_GET"],
      });
      window.location.pathname = "/login";
    },
  });

  useEffect(() => {
    if (
      projectsResponse?.[0]?.id &&
      data?.data.roles.includes(UserRoles.TEACHER)
    ) {
      setProjectId(projectsResponse?.[0].id + "");
    }
  }, [data?.data.roles, projectsResponse]);

  if (!data || isLoading || projectsLoading) return <div>Loading...</div>;

  const generateLink = async () => {
    if (!projectId) return;

    try {
      await ProjectsApi.publishProject(+projectId);
      toast.success("Testul postat cu success");
      setGeneratedLink(`http://localhost:3000/projects/view/${projectId}`);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  return (
    <div className="mt-2 flex justify-between">
      <div>
        Your id: {data?.data.id}
        {data?.data.roles.includes(UserRoles.TEACHER) ? (
          <>
            <div className="space-x-2">
              <span>Share a project with another users:</span>
              <select
                className="border outline-none px-2"
                value={projectId || projectsResponse?.[0].id}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projectsResponse?.map(({ id }) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={generateLink}>Generate</Button>
            <div>Link to share:</div>
            {generatedLink ? (
              <span
                className="cursor-pointer"
                onClick={async () => {
                  await navigator.clipboard.writeText(generatedLink);
                  toast.success("Link copied to clipboard");
                }}
              >
                {generatedLink}
              </span>
            ) : null}
          </>
        ) : null}
      </div>

      <Button onClick={() => logout()} className="float-right">
        Logout
      </Button>
    </div>
  );
}
