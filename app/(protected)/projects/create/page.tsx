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
import { nanoid } from "nanoid";

export type GameType =
  | "GuessTheAnimal"
  | "MatchColors"
  | "MatchQuantity"
  | "MemoryCards"
  | "NumberNeighbor";

export interface GameTypes {
  title: string;
  type: GameType;
}

export interface Game {
  type: GameType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  id: string;
}

const gameNames: GameTypes[] = [
  {
    type: "GuessTheAnimal",
    title: "Ghicește denumirea",
  },
  {
    type: "MatchColors",
    title: "Potrivește culorile",
  },
  {
    type: "MatchQuantity",
    title: "Potrivește mulțimea",
  },
  {
    type: "MemoryCards",
    title: "Card de memorie",
  },
  {
    type: "NumberNeighbor",
    title: "Număr vecin",
  },
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
    staleTime: 0,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user?.data.roles.includes(UserRoles.TEACHER)) {
    toast.error("You do not have rights to create project");
    router.push("/dashboard");
    return;
  }

  const addGame = (type: GameType) => {
    setGames((prevState) => [...prevState, { type, id: nanoid() }]);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      toast.error("Adăugați cel puțin un bloc");
      return;
    }
    try {
      const response = await ProjectsApi.saveProject(games);
      router.push(`/projects/edit/${response?.data.id}`);
      toast.success("Proiect salvat cu succes");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const deleteGame = (gameId: string) => {
    const newGames = games.filter(({ id }) => gameId !== id);
    setGames(newGames);
  };

  return (
    <div>
      {!games.length ? <h2 className="mt-2">Adăugați primul bloc</h2> : null}
      <div className="control-buttons flex justify-between sticky top-0 bg-[#fcf6e4] z-[1] py-2">
        <div className="flex gap-x-2">
          {gameNames.map(({ type, title }) => (
            <Button key={type} onClick={() => addGame(type)}>
              {title}
            </Button>
          ))}
        </div>
        <Button onClick={saveProject}>Salvează</Button>
      </div>

      <div className="flex flex-col gap-y-4">
        {games.map(({ type, id }, index) => {
          switch (type) {
            case "GuessTheAnimal": {
              return (
                <div className="relative" key={`${type}-${id}`}>
                  <div
                    className="absolute top-0 -left-6 cursor-pointer"
                    onClick={() => deleteGame(id)}
                  >
                    &#x2715;
                  </div>
                  <GuessTheAnimal
                    onDataChange={(data) => handleDataChange(index, data)}
                    isEditable
                    roles={user?.data.roles}
                  />
                </div>
              );
            }
            case "MatchColors": {
              return (
                <div className="relative" key={`${type}-${id}`}>
                  <div
                    className="absolute top-0 -left-6 cursor-pointer"
                    onClick={() => deleteGame(id)}
                  >
                    &#x2715;
                  </div>
                  <MatchColors
                    onDataChange={(data) => handleDataChange(index, data)}
                    isEditable
                    roles={user?.data.roles}
                  />
                </div>
              );
            }
            case "MatchQuantity": {
              return (
                <div className="relative" key={`${type}-${id}`}>
                  <div
                    className="absolute top-0 -left-6 cursor-pointer"
                    onClick={() => deleteGame(id)}
                  >
                    &#x2715;
                  </div>
                  <MatchQuantity
                    onDataChange={(data) => handleDataChange(index, data)}
                    isEditable
                    roles={user?.data.roles}
                  />
                </div>
              );
            }
            case "MemoryCards": {
              return (
                <div className="relative" key={`${type}-${id}`}>
                  <div
                    className="absolute top-0 -left-6 cursor-pointer"
                    onClick={() => deleteGame(id)}
                  >
                    &#x2715;
                  </div>
                  <MemoryCards
                    onDataChange={(data) => handleDataChange(index, data)}
                    isEditable
                    roles={user?.data.roles}
                  />
                </div>
              );
            }
            case "NumberNeighbor": {
              return (
                <div className="relative" key={`${type}-${id}`}>
                  <div
                    className="absolute top-0 -left-6 cursor-pointer"
                    onClick={() => deleteGame(id)}
                  >
                    &#x2715;
                  </div>
                  <NumberNeighbor
                    onDataChange={(data) => handleDataChange(index, data)}
                    isEditable
                    roles={user?.data.roles}
                  />
                </div>
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
