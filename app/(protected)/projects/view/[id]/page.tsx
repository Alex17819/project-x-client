"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import {
  GuessTheAnimal,
  MatchColors,
  MatchQuantity,
  MemoryCards,
  NumberNeighbor,
} from "@/components/blocks";
import { ProjectsApi } from "@/api/projects";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Game } from "@/app/(protected)/projects/create/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRoles } from "@/types/user";
import { toast } from "react-toastify";

export default function ProjectsPage() {
  const router = useRouter();
  const [parsedData, setParsedData] = useState<Game[]>([]);
  const params = useParams<{ id?: string }>();
  const id = Number(params?.id);

  const { data, isLoading } = useQuery({
    queryKey: [`PROJECT_${id}_GET`],
    queryFn: async () => {
      return await ProjectsApi.getProjectData(id);
    },
    retry: false,
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!data || !userData) return;

    if (data?.data.userId !== userData?.data.id) {
      router.push("/dashboard");
    }
  }, [data, data?.data.userId, router, userData, userData?.data.id]);

  useEffect(() => {
    if (data?.data) {
      try {
        const blocks = JSON.parse(data?.data?.blocks);
        setParsedData(blocks);
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);

  const roles = userData?.data.roles;

  const handleDataChange = (index: number, newData: Record<string, any>) => {
    setParsedData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        data: { ...updatedData[index].data, ...newData },
      };
      return updatedData;
    });
  };

  const saveProject = async () => {
    if (!parsedData?.length) {
      toast.error("Add at least one game");
      return;
    }
    try {
      const response = await ProjectsApi.updateProject(id, parsedData);
      toast.success("Project updated and saved successfully");
    } catch (error) {}
  };

  return isLoading || isUserLoading ? (
    <div className="size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <div className="mt-2 space-y-2">
      {userData?.data.roles.includes(UserRoles.TEACHER) ? (
        <div className="flex justify-between items-center">
          <Button>
            <Link href={`/projects/edit/${id}`}>Edit</Link>
          </Button>
          <Button onClick={saveProject}>Save</Button>
        </div>
      ) : null}
      {parsedData.map(({ type, data }, index) => {
        switch (type) {
          case "GuessTheAnimal": {
            return (
              <GuessTheAnimal
                key={`${type}-${index}`}
                data={data}
                roles={roles}
                onDataChange={(data) => handleDataChange(index, data)}
              />
            );
          }
          case "MatchColors": {
            return (
              <MatchColors
                key={`${type}-${index}`}
                data={data}
                roles={roles}
                onDataChange={(data) => handleDataChange(index, data)}
              />
            );
          }
          case "MatchQuantity": {
            return (
              <MatchQuantity
                key={`${type}-${index}`}
                data={data}
                roles={roles}
                onDataChange={(data) => handleDataChange(index, data)}
              />
            );
          }
          case "MemoryCards": {
            return (
              <MemoryCards
                key={`${type}-${index}`}
                data={data}
                roles={roles}
                onDataChange={(data) => handleDataChange(index, data)}
              />
            );
          }
          case "NumberNeighbor": {
            return (
              <NumberNeighbor
                key={`${type}-${index}`}
                data={data}
                roles={roles}
                onDataChange={(data) => handleDataChange(index, data)}
              />
            );
          }
          default: {
            return null;
          }
        }
      })}
    </div>
  );
}
