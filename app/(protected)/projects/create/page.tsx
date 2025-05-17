"use client";

import { useState } from "react";

import {
  GuessTheAnimal,
  MatchColors,
  MatchQuantity,
  MemoryCards,
  NumberNeighbor,
} from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { ProjectsApi } from "@/api/projects";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useRouter } from "next/navigation";
import { UserRoles } from "@/types/user";

export type GameType =
  | "GuessTheAnimal"
  | "MatchColors"
  | "MatchQuantity"
  | "MemoryCards"
  | "NumberNeighbor";

export interface Game {
  type: GameType;
  data?: Record<string, any>;
}

const gameNames: GameType[] = [
  "GuessTheAnimal",
  "MatchColors",
  "MatchQuantity",
  "MemoryCards",
  "NumberNeighbor",
];

export default function CreateProjectPage() {
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user?.data.roles.includes(UserRoles.TEACHER)) {
    toast.error("You do not have rights to create project");
    router.push("/dashboard");
    return;
  }

  const addGame = (type: GameType) => {
    setGames((prevState) => [...prevState, { type }]);
  };

  const handleDataChange = (index: number, newData: Record<string, any>) => {
    setGames((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        data: { ...updatedData[index].data, ...newData },
      };
      return updatedData;
    });
  };

  const saveProject = async () => {
    if (!games?.length) {
      toast.error("Add at least one game");
      return;
    }
    try {
      const response = await ProjectsApi.saveProject(games);
      router.push(`/projects/edit/${response?.data.id}`);
      toast.success("Project saved successfully");
    } catch (error) {}
  };

  return (
    <div>
      {!games.length ? <h2>Add the first game</h2> : null}
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

      <div className="flex flex-col gap-y-4">
        {games.map(({ type }, index) => {
          switch (type) {
            case "GuessTheAnimal": {
              return (
                <GuessTheAnimal
                  key={`${type}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)}
                  isEditable
                />
              );
            }
            case "MatchColors": {
              return (
                <MatchColors
                  key={`${type}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)}
                />
              );
            }
            case "MatchQuantity": {
              return (
                <MatchQuantity
                  key={`${type}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)}
                />
              );
            }
            case "MemoryCards": {
              return (
                <MemoryCards
                  key={`${type}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)}
                />
              );
            }
            case "NumberNeighbor": {
              return (
                <NumberNeighbor
                  key={`${type}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)}
                  roles={user?.data?.roles}
                />
              );
            }
            default: {
              return null;
            }
          }
        })}
      </div>
    </div>
  );
}
