"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";
import Image from "next/image";

export default function ProjectsPage() {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  // useEffect(() => {
  //   const getSmth = async () => {
  //     const res = await api.get("/auth/protected", {
  //       withCredentials: true,
  //     });
  //
  //     console.log(res);
  //   };
  //
  //   getSmth().catch((e) => console.log("PAGE ERROR", e));
  // }, []);

  const openGalleryModal = () => {
    setIsGalleryModalOpen(true);
  };

  const closeGalleryModal = () => {
    setIsGalleryModalOpen(false);
  };

  return (
    <div>
      <Button type="button" onClick={openGalleryModal}>
        Open Modal
      </Button>

      <Modal
        isOpen={isGalleryModalOpen}
        type="gallery"
        onClose={closeGalleryModal}
        onClick={(e) => {
          setImg(e);
          closeGalleryModal();
        }}
      />

      {img ? <Image src={img} alt="image" width={300} height={300} /> : null}
    </div>
  );
}
