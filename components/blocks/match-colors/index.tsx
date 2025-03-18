"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const colors = ["red", "blue", "green", "yellow"];
const images = ["strawberry.jpg", "frog.jpg", "chicken.jpg", "whale.jpg"];

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export const MatchColors = () => {
  const [selected, setSelected] = useState<{
    color: string | null;
    image: string | null;
  }>({
    color: null,
    image: null,
  });
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>([]);

  const colorRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const imageRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const newLines = Object.entries(matches).map(([color, image]) => {
      const colorEl = colorRefs.current[color];
      const imageEl = imageRefs.current[image];

      if (colorEl && imageEl) {
        const colorRect = colorEl.getBoundingClientRect();
        const imageRect = imageEl.getBoundingClientRect();

        return {
          color,
          x1: colorRect.right + window.scrollX,
          y1: colorRect.top + colorRect.height / 2 + window.scrollY,
          x2: imageRect.left + window.scrollX,
          y2: imageRect.top + imageRect.height / 2 + window.scrollY,
        };
      }
      return null;
    });

    setLines(newLines.filter((line) => line !== null));
  }, [matches]);

  const handleChoose = (type: "color" | "image", value: string) => {
    setSelected((prev) => {
      const newSelected = {
        ...prev,
        [type]: prev[type] === value ? null : value,
      };
      if (newSelected.color && newSelected.image) {
        setMatches((prevMatches) => {
          const updatedMatches = { ...prevMatches };

          Object.entries(prevMatches).forEach(([color, image]) => {
            if (color === newSelected.color || image === newSelected.image) {
              delete updatedMatches[color];
            }
          });

          updatedMatches[newSelected.color!] = newSelected.image!;
          return updatedMatches;
        });
        return { color: null, image: null };
      }
      return newSelected;
    });
  };

  return (
    <div className="flex gap-x-[250px] relative">
      <svg className="absolute size-full top-0 left-0 pointer-events-none">
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color ? line.color : "black"}
            strokeWidth="2"
          />
        ))}
      </svg>
      <ul className="flex flex-col gap-y-4">
        {colors.map((color, index) => {
          const isMatched =
            matches[color] || Object.values(matches).includes(color);

          return (
            <li
              className="cursor-pointer size-20 rounded-full"
              ref={(ref) => {
                if (ref) {
                  colorRefs.current[color] = ref;
                }
              }}
              key={index}
              style={{
                backgroundColor: color,
                outline:
                  selected.color === color
                    ? "2px solid black"
                    : isMatched
                      ? `2px solid ${color}`
                      : "",
              }}
              onClick={() => handleChoose("color", color)}
            />
          );
        })}
      </ul>
      <ul className="flex flex-col gap-y-4">
        {images.map((image, index) => {
          const isMatched =
            matches[image] || Object.values(matches).includes(image);
          const color = Object.entries(matches).find(
            ([, value]) => value === image
          );

          return (
            <li
              className="cursor-pointer size-20 rounded-full"
              key={index}
              ref={(ref) => {
                if (ref) {
                  imageRefs.current[image] = ref;
                }
              }}
            >
              <Image
                src={`/assets/images/${image}`}
                alt=""
                width="80"
                height="80"
                onClick={() => handleChoose("image", image)}
                style={{
                  outline:
                    selected.image === image
                      ? "2px solid black"
                      : isMatched
                        ? `2px solid ${color?.[0]}`
                        : "",
                  borderRadius: "100%",
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
