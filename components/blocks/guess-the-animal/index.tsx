"use client";

import Image from "next/image";
import { useRef, useState, KeyboardEvent } from "react";

const answer = "octopus";

export const GuessTheAnimal = () => {
  const [finalAnswer, setFinalAnswer] = useState<string[]>([]);

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

  return (
    <div className="border bg-cyan-300 flex justify-center items-center flex-col">
      <div>
        <Image
          src="/assets/images/octopus.jpg"
          alt="octopus"
          width={700}
          height={700}
        />
      </div>
      <div className="p-2 flex gap-x-2">
        {[...Array(answer.length)].map((_, index) => (
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
        ))}
      </div>
    </div>
  );
};
