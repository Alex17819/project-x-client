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
import { useEffect, useRef, useState } from "react";
import { Game } from "@/app/(protected)/projects/create/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRoles } from "@/types/user";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";

export default function ProjectsPage() {
  const router = useRouter();
  const [parsedData, setParsedData] = useState<Game[]>([]);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const params = useParams<{ id?: string }>();
  const id = Number(params?.id);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

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

  const generatePdf = () => {
    setIsPdfGenerating(true);
    const element = pageRef.current;
    const options = {
      filename: "games-for-kids.pdf",
      image: { type: "jpeg", quality: 0.85 },
      html2canvas: {
        scale: 1.5, // Улучшает качество PDF
        useCORS: true, // Для работы с изображениями из сети
        logging: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => setIsPdfGenerating(false));
  };

  return isLoading || isUserLoading ? (
    <div className="size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <div className="space-y-2">
      {isPdfGenerating ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-20">
          <div className="size-full flex justify-center items-center">
            <div className="loader" />
          </div>
        </div>
      ) : null}
      {userData?.data.roles.includes(UserRoles.TEACHER) ? (
        <div className="flex bg-[#ECEEF0] z-10 sticky top-0 py-2 border-b border-b-black justify-between items-center">
          <Button>
            <Link href={`/projects/edit/${id}`}>Edit</Link>
          </Button>
          <div className="space-x-2">
            <Button onClick={generatePdf}>Generate PDF</Button>
            <Button onClick={saveProject}>Save</Button>
          </div>
        </div>
      ) : null}
      <div ref={pageRef} className="space-y-2">
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
    </div>
  );
}
