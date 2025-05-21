"use client";

import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { ProjectsApi } from "@/api/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRoles } from "@/types/user";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["PROJECTS_GET"],
    queryFn: async () => {
      const response = await ProjectsApi.getProjects();
      return response.data;
    },
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (isUserLoading) return;

    if (user?.status !== 200) {
      router.push("/login");
      return;
    }
  }, [isUserLoading, router, user]);

  return isLoading || isUserLoading ? (
    <div className="size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <>
      {!data?.length && user?.data.roles.includes(UserRoles.TEACHER) ? (
        <h2>
          You do not have any project.{" "}
          <Link className="text-blue-400" href="/projects/create">
            Create
          </Link>{" "}
          the first one
        </h2>
      ) : (
        <div className="flex justify-between">
          <div>
            <h2>Your projects</h2>
            <div className="mt-2 flex gap-x-2">
              {user?.data.ProjectUser.map(({ projectId }) => (
                <Link
                  href={`/projects/view/${projectId}`}
                  key={projectId}
                  className="border border-gray-400 p-2"
                >
                  {projectId}
                </Link>
              ))}
            </div>
          </div>

          {user?.data.roles.includes(UserRoles.TEACHER) ? (
            <Button className="h-10">
              <Link href="/projects/create">Create new</Link>
            </Button>
          ) : null}
        </div>
      )}
    </>
  );
}
