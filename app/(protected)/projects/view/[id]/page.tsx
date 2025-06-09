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
import { useAuth } from "@/hooks";

export default function ViewProjectPage() {
  const router = useRouter();
  const [parsedData, setParsedData] = useState<Game[]>([]);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const params = useParams<{ id?: string }>();
  const id = Number(params?.id);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const isAuth = useAuth();

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
    staleTime: 0,
  });

  const hasProject = userData?.data.ProjectUser.some(
    (project: { projectId: number }) => project.projectId === id
  );

  useEffect(() => {
    if (isUserLoading || isLoading) return;
    if (userData?.status === 200 && !hasProject && data?.data.isPublic) {
      const shareProject = async () => {
        await ProjectsApi.shareProject(String(id), String(userData?.data.id));
      };

      shareProject().then(() => {
        window.location.reload();
      });
    }
    if (
      !data?.data.isPublic &&
      !userData?.data.roles.includes(UserRoles.TEACHER)
    ) {
      router.push("/dashboard");
      return;
    }
  }, [
    data,
    hasProject,
    id,
    isAuth,
    isLoading,
    isUserLoading,
    router,
    userData,
  ]);

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

  const roles = userData?.data.roles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      toast.error("Adăugați cel puțin un bloc");
      return;
    }
    try {
      await ProjectsApi.updateProject(id, parsedData);
      toast.success("Proiect actualizat și salvat cu succes");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const generatePdf = () => {
    setIsPdfGenerating(true);
    const element = pageRef.current;
    const options = {
      filename: "games-for-kids.pdf",
      image: { type: "jpeg", quality: 0.85 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
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
    <div className="mt-2 size-full flex justify-center items-center">
      <div className="loader" />
    </div>
  ) : (
    <div className="mt-2 space-y-2">
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
            <Link href={`/projects/edit/${id}`}>Editare</Link>
          </Button>
          <div className="flex gap-x-2 text-right">
            <Button onClick={generatePdf}>Generare PDF</Button>
            <Button onClick={saveProject}>Salvează</Button>
          </div>
        </div>
      ) : null}
      {!userData?.data.roles.includes(UserRoles.TEACHER) ? (
        <div className="flex gap-x-2 text-right">
          <Button onClick={generatePdf}>Generare PDF</Button>
          <Button onClick={saveProject}>Salvează</Button>
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
                  isPdfGenerating={isPdfGenerating}
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
