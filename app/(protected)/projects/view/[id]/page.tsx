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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Game } from "@/app/(protected)/projects/create/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRoles } from "@/types/user";

export default function ProjectsPage() {
  const [parsedData, setParsedData] = useState<Game[]>([]);
  const params = useParams();
  const id = params?.id;

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
    if (data?.data) {
      try {
        const blocks = JSON.parse(data?.data?.blocks);
        setParsedData(blocks);
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);

  return (
    <div>
      {userData?.data.roles.includes(UserRoles.TEACHER) ? (
        <Button>
          <Link href={`/projects/edit/${id}`}>Edit</Link>
        </Button>
      ) : null}
      {parsedData.map(({ type, data }, index) => {
        switch (type) {
          case "GuessTheAnimal": {
            return <GuessTheAnimal key={`${type}-${index}`} data={data} />;
          }
          case "MatchColors": {
            return <MatchColors key={`${type}-${index}`} data={data} />;
          }
          case "MatchQuantity": {
            return <MatchQuantity key={`${type}-${index}`} data={data} />;
          }
          case "MemoryCards": {
            return <MemoryCards key={`${type}-${index}`} data={data} />;
          }
          case "NumberNeighbor": {
            return <NumberNeighbor key={`${type}-${index}`} data={data} />;
          }
          default: {
            return null;
          }
        }
      })}
    </div>
  );
}
