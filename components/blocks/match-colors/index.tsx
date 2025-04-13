"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/modals/modal";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-toastify";

const roles = ["USER", "TEACHER"];

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

interface Columns {
  colors: (string | null)[];
  images: (string | null)[];
}

export const MatchColors = () => {
  const [columns, setColumns] = useState<Columns>({
    colors: [null],
    images: [null],
  });
  const [selected, setSelected] = useState<{
    color: string | null;
    image: string | null;
  }>({
    color: null,
    image: null,
  });
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [img, setImg] = useState("");
  const [colorPickerColor, setColorPickerColor] = useState("#aabbcc");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorPickerCoordinates, setColorPickerCoordinates] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [colorIndexToChange, setColorIndexToChange] = useState<number | null>(
    null
  );
  const [imageIndexToChange, setImageIndexToChange] = useState<number | null>(
    null
  );

  const colorRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const imageRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const colorPickerLiRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines = Object.entries(matches).map(([color, image]) => {
      const colorEl = colorRefs.current[color];
      const imageEl = imageRefs.current[image];

      if (colorEl && imageEl) {
        const colorRect = colorEl.getBoundingClientRect();
        const imageRect = imageEl.getBoundingClientRect();

        return {
          color,
          x1: colorRect.right - containerRect.left,
          y1: colorRect.top + colorRect.height / 2 - containerRect.top,
          x2: imageRect.left - containerRect.left,
          y2: imageRect.top + imageRect.height / 2 - containerRect.top,
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

  const addRow = () => {
    setColumns((prevState) => ({
      colors: [...prevState.colors, null],
      images: [...prevState.images, null],
    }));
  };

  const chooseColor = (
    index: number,
    color: string | undefined = undefined
  ) => {
    if (!roles.includes("TEACHER")) return;
    if (color) setColorPickerColor(color);

    setColorIndexToChange(index);
    const element = colorPickerLiRef.current[index];
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setColorPickerCoordinates({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    });
    setIsColorPickerOpen(true);
  };

  const chooseImage = (index: number) => {
    if (!roles.includes("TEACHER")) return;

    setImageIndexToChange(index);
    setIsGalleryModalOpen(true);
  };

  useEffect(() => {
    if (columns.images.includes(img)) {
      toast.error("Duplicated image");
      return;
    }

    if (img === "") {
      return;
    }

    const newImages = [...columns.images];
    const newMatches = { ...matches };
    if (imageIndexToChange || imageIndexToChange === 0) {
      const key = Object.keys(newMatches).find(
        (key) => newMatches[key] === newImages[imageIndexToChange]
      );
      if (key) {
        delete newMatches[key];
        newMatches[key] = img;
      }
      newImages[imageIndexToChange] = img;
    }

    setColumns((prevState) => ({
      ...prevState,
      images: newImages,
    }));
    setMatches(newMatches);
    setImg("");
    setImageIndexToChange(null);
  }, [img, imageIndexToChange, columns.images]);

  const deleteRow = (rowIndex: number) => {
    if (columns.images.length === 1 || columns.colors.length === 1) return;

    const newColumns = {
      colors: [...columns.colors],
      images: [...columns.images],
    };

    newColumns.colors = newColumns.colors.filter(
      (_, index) => rowIndex !== index
    );
    newColumns.images = newColumns.images.filter(
      (_, index) => rowIndex !== index
    );

    setColumns(newColumns);
    const newMatches = {
      ...matches,
    };
    Object.entries(newMatches).forEach(([key, value]) => {
      if (
        !newColumns.colors.includes(key) ||
        !newColumns.images.includes(value)
      ) {
        delete newMatches[key];
      }
    });

    setMatches(newMatches);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        !(e.target as HTMLElement).classList.contains(
          "react-colorful__interactive"
        ) &&
        !(e.target as HTMLElement).classList.contains("react-colorful__pointer")
      ) {
        setIsColorPickerOpen(false);
        setColorIndexToChange(null);
      }
    };

    document.body.addEventListener("click", onClick);

    return () => {
      document.body.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex gap-x-[250px] relative">
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
        {columns.colors.map((color, index) => {
          if (color === null) {
            return (
              <li
                key={index}
                ref={(el) => {
                  if (el) {
                    colorPickerLiRef.current[index] = el;
                  }
                }}
                className="cursor-pointer size-20 rounded-full bg-black/10 relative group"
                onClick={() => chooseColor(index)}
              >
                {roles.includes("TEACHER") ? (
                  <span
                    className="absolute top-0 -right-[20px] opacity-0 transition-all group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRow(index);
                    }}
                  >
                    &#x2715;
                  </span>
                ) : null}
              </li>
            );
          }

          const isMatched =
            matches[color] || Object.values(matches).includes(color);

          return (
            <li
              className="cursor-pointer size-20 rounded-full relative group flex justify-center items-center"
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
            >
              {roles.includes("TEACHER") ? (
                <span
                  className="opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    chooseColor(index, color);
                  }}
                >
                  <Image
                    src="assets/icons/gear.svg"
                    alt="gear icon"
                    width={16}
                    height={16}
                    className="fill-white"
                  />
                </span>
              ) : null}
              {roles.includes("TEACHER") ? (
                <span
                  className="absolute top-0 -right-[20px] opacity-0 transition-all group-hover:opacity-100"
                  onClick={() => deleteRow(index)}
                >
                  &#x2715;
                </span>
              ) : null}
            </li>
          );
        })}
        {roles.includes("TEACHER") ? (
          <li
            className="cursor-pointer size-20 rounded-full bg-black/30 text-[40px] text-white flex justify-center items-center"
            onClick={addRow}
          >
            +
          </li>
        ) : null}
      </ul>
      <ul className="flex flex-col gap-y-4">
        {columns.images.map((image, index) => {
          if (image === null) {
            return (
              <li
                key={index}
                className="cursor-pointer size-20 rounded-full bg-black/10 relative group"
                onClick={() => chooseImage(index)}
              >
                {roles.includes("TEACHER") ? (
                  <span
                    className="absolute top-0 -right-[20px] opacity-0 transition-all group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRow(index);
                    }}
                  >
                    &#x2715;
                  </span>
                ) : null}
              </li>
            );
          }

          const isMatched =
            matches[image] || Object.values(matches).includes(image);
          const color = Object.entries(matches).find(
            ([, value]) => value === image
          );

          return (
            <li
              className="cursor-pointer size-20 rounded-full relative group"
              key={index}
              ref={(ref) => {
                if (ref) {
                  imageRefs.current[image] = ref;
                }
              }}
            >
              <Image
                src={image}
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
                className="size-full object-cover"
              />
              {roles.includes("TEACHER") ? (
                <span
                  className="absolute top-0 -right-[20px] opacity-0 transition-all group-hover:opacity-100"
                  onClick={() => deleteRow(index)}
                >
                  &#x2715;
                </span>
              ) : null}
              {roles.includes("TEACHER") ? (
                <span
                  className="text-white opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    chooseImage(index);
                  }}
                >
                  <Image
                    src="assets/icons/gear.svg"
                    alt="gear icon"
                    width={16}
                    height={16}
                    className="fill-black"
                  />
                </span>
              ) : null}
            </li>
          );
        })}
        {roles.includes("TEACHER") ? (
          <li
            className="cursor-pointer size-20 rounded-full bg-black/30 text-[40px] text-white flex justify-center items-center"
            onClick={addRow}
          >
            +
          </li>
        ) : null}
      </ul>

      <Modal
        type="gallery"
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onClick={(e) => {
          setImg(e);
          setIsGalleryModalOpen(false);
        }}
      />
      {isColorPickerOpen ? (
        <div
          className="absolute -translate-y-[50%]"
          style={{
            top: colorPickerCoordinates.y,
            left: colorPickerCoordinates.x,
          }}
        >
          <HexColorPicker
            color={colorPickerColor}
            onChange={(newColor) => {
              setColorPickerColor(newColor);

              const newColors = [...columns.colors];
              const newMatches = { ...matches };

              if (colorIndexToChange || colorIndexToChange === 0) {
                if (newColors[colorIndexToChange]) {
                  const oldValue = newMatches[newColors[colorIndexToChange]];
                  delete newMatches[newColors[colorIndexToChange]];
                  newMatches[newColor] = oldValue;
                }
                newColors[colorIndexToChange] = newColor;
              }
              setColumns((prevState) => ({
                ...prevState,
                colors: newColors,
              }));
              setMatches(newMatches);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
