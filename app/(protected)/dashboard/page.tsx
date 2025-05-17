"use client";

import { useEffect, useState } from "react";

import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { ProjectsApi } from "@/api/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["PROJECTS_GET"],
    queryFn: async () => {
      const response = await ProjectsApi.getProjects();
      return response.data;
    },
  });

  console.log(data);

  return isLoading ? (
    <div className="size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <>
      {!data.length ? (
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
              {data.map(({ id }) => (
                <Link
                  href={`/projects/${id}`}
                  key={id}
                  className="border border-gray-400 p-2"
                >
                  {id}
                </Link>
              ))}
            </div>
          </div>

          <Button className="h-10">
            <Link href="/projects/create">Create new</Link>
          </Button>
        </div>
      )}
    </>
  );
}
