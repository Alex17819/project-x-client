"use client";

import Image from "next/image";
import { useRef, useState, KeyboardEvent } from "react";
import { Modal } from "@/components/modals/modal";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const roles = ["USER", "TEACHER"];

export const GuessTheAnimal = () => {
  const [answer, setAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState<string[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [img, setImg] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const updatedAnswer = [...finalAnswer];
    updatedAnswer[index] = value;
    setFinalAnswer(updatedAnswer);

    if (value && index < answer.length - 1 && !updatedAnswer[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !finalAnswer[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  console.log(isPreview);

  return (
    <div className="border bg-cyan-300 flex justify-center items-center flex-col">
      <div className="relative">
        {img ? (
          <Image
            src={img}
            alt={img}
            width={700}
            height={700}
            className={clsx({
              "cursor-pointer": roles.includes("TEACHER"),
            })}
            onClick={() => {
              if (!roles.includes("TEACHER")) return;
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
              "cursor-pointer": roles.includes("TEACHER"),
            })}
            onClick={() => {
              if (!roles.includes("TEACHER")) return;
              setIsGalleryModalOpen(true);
            }}
          />
        )}
      </div>
      <div className="p-2 flex w-full justify-center gap-x-2">
        {isPreview || !roles.includes("TEACHER") ? (
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
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your asnwer"
              className="w-full"
            />
          </div>
        )}
      </div>
      {roles.includes("TEACHER") ? (
        <Button
          onClick={() => setIsPreview(!isPreview)}
          disabled={!img || !answer}
        >
          Preview
        </Button>
      ) : null}

      <Modal
        type="gallery"
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onClick={(e) => {
          setImg(e);
          setIsGalleryModalOpen(false);
        }}
      />
    </div>
  );
};
