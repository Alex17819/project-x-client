"use client";

import Image from "next/image";
import { useRef, useState, KeyboardEvent, useEffect } from "react";
import { Modal } from "@/components/modals/modal";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRoles } from "@/types/user";

interface Props {
  onDataChange?: (data: {
    img?: string;
    answer?: string;
    finalAnswer?: string[];
  }) => void;
  data?: {
    img?: string;
    answer?: string;
    finalAnswer?: string[];
  };
  isEditable?: boolean;
  roles?: UserRoles[];
}

export const GuessTheAnimal = ({
  onDataChange,
  data,
  isEditable = false,
  roles,
}: Props) => {
  const [answer, setAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState<string[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [img, setImg] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (data?.img) setImg(data?.img);
    if (data?.answer) setAnswer(data?.answer);
    if (data?.finalAnswer) setFinalAnswer(data?.finalAnswer);
  }, [data]);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const updatedAnswer = [...finalAnswer];
    updatedAnswer[index] = value;
    setFinalAnswer(updatedAnswer);
    onDataChange?.({
      finalAnswer: updatedAnswer,
    });

    if (value && index < answer.length - 1 && !updatedAnswer[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !finalAnswer[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="border-4 border-amber-600 flex justify-center items-center flex-col py-4">
      <div className="relative">
        {img ? (
          <Image
            src={img}
            alt={img}
            width={700}
            height={700}
            className={clsx({
              "cursor-pointer":
                isEditable && roles?.includes(UserRoles.TEACHER),
            })}
            onClick={() => {
              if (!roles?.includes(UserRoles.TEACHER) || !isEditable) return;
              setIsGalleryModalOpen(true);
            }}
          />
        ) : (
          <Image
            src="/assets/images/image-placeholder.jpg"
            alt={img}
            width={700}
            height={700}
            className={clsx({
              "cursor-pointer":
                isEditable && roles?.includes(UserRoles.TEACHER),
            })}
            onClick={() => {
              if (!roles?.includes(UserRoles.TEACHER) || !isEditable) return;
              setIsGalleryModalOpen(true);
            }}
          />
        )}
      </div>
      <div className="p-2 flex w-full justify-center gap-x-2">
        {isPreview || !isEditable || !roles?.includes(UserRoles.TEACHER) ? (
          [...Array(answer.length)].map((_, index) => (
            <input
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              value={finalAnswer[index] ?? ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              key={index}
              type="text"
              className="border size-10 text-center outline-none"
            />
          ))
        ) : (
          <div className="w-full max-w-[700px]">
            <Input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                onDataChange?.({
                  answer: e.target.value,
                });
              }}
              placeholder="Introduceți răspunsul"
              className="w-full"
            />
          </div>
        )}
      </div>
      {roles?.includes(UserRoles.TEACHER) && isEditable ? (
        <Button
          onClick={() => setIsPreview(!isPreview)}
          disabled={!img || !answer}
        >
          Vizualizează
        </Button>
      ) : null}

      <Modal
        type="gallery"
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onClick={(e) => {
          setImg(e);
          setIsGalleryModalOpen(false);
          onDataChange?.({ img: e });
        }}
      />
    </div>
  );
};
