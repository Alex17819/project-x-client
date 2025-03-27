"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images: { src: string; id: number }[] = [...Array(5)].map((_, index) => ({
  src: "/assets/images/test-match-quantity.jpg",
  id: index,
}));
const numbers = [1, 2, 3, 4, 5];

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const MatchQuantity = () => {
  const [selected, setSelected] = useState({
    image: null,
    number: null,
  });
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const numberRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines = Object.entries(matches).map(([image, number]) => {
      const imageEl = imageRefs.current[image];
      const numberEl = numberRefs.current[number];

      if (imageEl && numberEl) {
        const imageRect = imageEl.getBoundingClientRect();
        const numberRect = numberEl.getBoundingClientRect();

        return {
          x1: imageRect.right - containerRect.left,
          y1: imageRect.top + imageRect.height / 2 - containerRect.top,
          x2: numberRect.left - containerRect.left,
          y2: numberRect.top + numberRect.height / 2 - containerRect.top,
        };
      }
      return null;
    });

    setLines(newLines.filter((line) => line !== null));
  }, [matches]);

  const handleSelect = (type: "image" | "number", index: number) => {
    setSelected((prevState) => {
      const newSelected = {
        ...prevState,
        [type]: prevState[type] === index ? null : index,
      };

      if (newSelected.image !== null && newSelected.number !== null) {
        setMatches((prevMatches) => {
          const updatedMatches = { ...prevMatches };

          Object.entries(prevMatches).forEach(([image, number]) => {
            if (image === newSelected.image || number === newSelected.number) {
              delete updatedMatches[image];
            }
          });

          updatedMatches[newSelected.image!] = newSelected.number!;
          return updatedMatches;
        });

        return { image: null, number: null };
      }

      return newSelected;
    });
  };

  return (
    <div ref={containerRef} className="relative flex gap-x-[250px]">
      <svg className="absolute size-full top-0 left-0 pointer-events-none">
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="black"
            strokeWidth="2"
          />
        ))}
      </svg>
      <ul className="flex flex-col gap-y-2">
        {images.map((image, index) => (
          <li
            ref={(ref) => {
              if (ref) imageRefs.current[image.id] = ref;
            }}
            key={index}
            className={`cursor-pointer size-40 rounded-sm border border-2 ${selected.image === image.id ? "border-blue-500" : ""}`}
            onClick={() => handleSelect("image", image.id)}
          >
            <Image
              className="w-full h-full"
              src={image.src}
              width={50}
              height={50}
              alt="animals"
            />
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-y-2">
        {numbers.map((number, index) => (
          <li
            ref={(ref) => {
              if (ref) numberRefs.current[index] = ref;
            }}
            key={index}
            className={`cursor-pointer size-40 rounded-md border-2 flex justify-center items-center text-4xl ${selected.number === index ? "border-blue-500" : ""}`}
            onClick={() => handleSelect("number", index)}
          >
            {number}
          </li>
        ))}
      </ul>
    </div>
  );
};
