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
import { Game, GameType } from "@/app/(protected)/projects/create/page";
import { toast } from "react-toastify";
import { UserRoles } from "@/types/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const gameNames: GameType[] = [
  "GuessTheAnimal",
  "MatchColors",
  "MatchQuantity",
  "MemoryCards",
  "NumberNeighbor",
];

export default function ProjectsPage() {
  const [parsedData, setParsedData] = useState<Game[]>([]);
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  console.log(parsedData);

  const { data, isLoading } = useQuery({
    queryKey: [`PROJECT_${id}_GET`],
    queryFn: async () => {
      return await ProjectsApi.getProjectData(id);
    },
    retry: false,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

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

  const addGame = (type: GameType) => {
    setParsedData((prevState) => [...prevState, { type }]);
  };

  if (isUserLoading || isLoading) return <div>Loading...</div>;
  if (!user?.data.roles.includes(UserRoles.TEACHER)) {
    toast.error("You do not have rights to edit the project");
    router.push("/dashboard");
    return;
  }

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

  return (
    <div>
      <Button>
        <Link href={`/projects/view/${id}`}>View</Link>
      </Button>
      <div className="flex justify-between">
        <div className="space-x-1">
          {gameNames.map((gameName) => (
            <Button key={gameName} onClick={() => addGame(gameName)}>
              {gameName}
            </Button>
          ))}
        </div>
        <Button onClick={saveProject}>Save</Button>
      </div>
      {parsedData.map(({ type, data }, index) => {
        switch (type) {
          case "GuessTheAnimal": {
            return (
              <GuessTheAnimal
                key={`${type}-${index}`}
                onDataChange={(data) => handleDataChange(index, data)}
                data={data}
                isEditable
              />
            );
          }
          case "MatchColors": {
            return (
              <MatchColors
                key={`${type}-${index}`}
                onDataChange={(data) => handleDataChange(index, data)}
                data={data}
                isEditable
              />
            );
          }
          case "MatchQuantity": {
            return (
              <MatchQuantity
                key={`${type}-${index}`}
                onDataChange={(data) => handleDataChange(index, data)}
                data={data}
                isEditable
              />
            );
          }
          case "MemoryCards": {
            return (
              <MemoryCards
                key={`${type}-${index}`}
                data={data}
                onDataChange={(data) => handleDataChange(index, data)}
                isEditable
              />
            );
          }
          case "NumberNeighbor": {
            return (
              <NumberNeighbor
                key={`${type}-${index}`}
                data={data}
                onDataChange={(data) => handleDataChange(index, data)}
                isEditable
                roles={user?.data.roles}
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
