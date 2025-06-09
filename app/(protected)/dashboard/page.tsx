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
          Nu aveți niciun proiect.{" "}
          <Link className="text-blue-400" href="/projects/create">
            Creați-l
          </Link>{" "}
          pe primul
        </h2>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Proiectele tale</h2>

            {user?.data.roles.includes(UserRoles.TEACHER) ? (
              <Button className="h-10">
                <Link href="/projects/create">Creare proiect nou</Link>
              </Button>
            ) : null}
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {user?.data.ProjectUser.map(({ projectId }) => (
              <Link
                href={`/projects/view/${projectId}`}
                key={projectId}
                className="border border-gray-400 p-8 hover:border-gray-900 transition-colors"
              >
                {projectId}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
