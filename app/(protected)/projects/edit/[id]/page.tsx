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
import {
  Game,
  GameType,
  GameTypes,
} from "@/app/(protected)/projects/create/page";
import { toast } from "react-toastify";
import { UserRoles } from "@/types/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { nanoid } from "nanoid";

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

export default function EditProjectPage() {
  const [parsedData, setParsedData] = useState<Game[]>([]);
  const params = useParams<{ id?: string }>();
  const id = Number(params?.id);
  const router = useRouter();

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
    staleTime: 0,
  });

  useEffect(() => {
    if (!data || !user) return;
    if (
      !user?.data.roles.includes(UserRoles.TEACHER) ||
      data?.data.userId !== user?.data.id
    ) {
      router.push("/dashboard");
      return;
    }
  }, [data, data?.data.userId, router, user, user?.data.id]);

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
        const blocks = JSON.parse(data?.data.data.blocks);
        setParsedData(blocks);
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);

  const addGame = (type: GameType) => {
    setParsedData((prevState) => [...prevState, { type, id: nanoid() }]);
  };

  const deleteGame = (gameId: string) => {
    const newGames = parsedData.filter(({ id }) => gameId !== id);
    setParsedData(newGames);
  };

  if (isUserLoading || isLoading) return <div>Loading...</div>;
  if (!user?.data.roles.includes(UserRoles.TEACHER)) {
    toast.error("You do not have rights to edit the project");
    router.push("/dashboard");
    return;
  }

  const saveProject = async () => {
    if (!parsedData?.length) {
      toast.error("Adăugați cel puțin un bloc");
      return;
    }
    try {
      await ProjectsApi.updateProject(id, parsedData);
      toast.success("Proiect actualizat și salvat cu succes");
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading || isUserLoading ? (
    <div className="size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <div className="space-y-2">
      <div className="sticky space-y-2 z-20 bg-[#ECEEF0] top-0 py-2 border-b border-b-black">
        <Button>
          <Link href={`/projects/view/${id}`}>Vizualizare</Link>
        </Button>
        <div className="flex justify-between">
          <div className="space-x-1">
            {gameNames.map(({ type, title }) => (
              <Button key={type} onClick={() => addGame(type)}>
                {title}
              </Button>
            ))}
          </div>
          <Button onClick={saveProject}>Salvează</Button>
        </div>
      </div>
      {parsedData.map(({ type, data, id }, index) => {
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
                  data={data}
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
                  data={data}
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
                  data={data}
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
                  data={data}
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
                  data={data}
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
  );
}
