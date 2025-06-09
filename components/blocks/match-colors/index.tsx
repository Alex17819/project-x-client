"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/modals/modal";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-toastify";
import { UserRoles } from "@/types/user";
import { clsx } from "clsx";

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

interface Props {
  onDataChange?: (data: {
    lines?: Line[];
    matches?: Record<string, string>;
    columns?: Columns;
  }) => void;
  data?: {
    lines?: Line[];
    matches?: Record<string, string>;
    columns?: Columns;
  };
  isEditable?: boolean;
  roles?: UserRoles[];
  isPdfGenerating?: boolean;
}

export const MatchColors = ({
  onDataChange,
  data,
  isEditable = false,
  roles,
  isPdfGenerating = false,
}: Props) => {
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
    if (!data) return;
    if (data?.matches) setMatches(data?.matches);
    if (data?.lines) setLines(data?.lines);
    if (data?.columns) setColumns(data?.columns);
  }, [data]);

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

    const newLinesFiltered = newLines.filter((line) => line !== null);

    setLines(newLinesFiltered);
    onDataChange?.({
      lines: newLinesFiltered,
    });
  }, [matches]);

  const handleChoose = (type: "color" | "image", value: string) => {
    const newSelected = {
      ...selected,
      [type]: selected[type] === value ? null : value,
    };
    if (newSelected.color && newSelected.image) {
      const updatedMatches = { ...matches };

      Object.entries(matches).forEach(([color, image]) => {
        if (color === newSelected.color || image === newSelected.image) {
          delete updatedMatches[color];
        }
      });

      updatedMatches[newSelected.color!] = newSelected.image!;
      onDataChange?.({
        matches: updatedMatches,
      });
      setMatches(updatedMatches);
      setSelected({ color: null, image: null });
      return;
    }
    setSelected(newSelected);
  };

  const addRow = () => {
    const newRows = {
      colors: [...columns.colors, null],
      images: [...columns.images, null],
    };
    onDataChange?.({
      columns: newRows,
    });
    setColumns(newRows);
  };

  const chooseColor = (
    index: number,
    color: string | undefined = undefined
  ) => {
    if (!roles?.includes(UserRoles.TEACHER)) return;
    if (color) setColorPickerColor(color);

    setColorIndexToChange(index);
    const element = colorPickerLiRef.current[index];
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setColorPickerCoordinates({
      x: rect.left + window.pageXOffset,
      y: element.offsetTop + 60,
    });
    setIsColorPickerOpen(true);
  };

  const chooseImage = (index: number) => {
    if (!roles?.includes(UserRoles.TEACHER)) return;

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
    onDataChange?.({
      matches: newMatches,
      columns: {
        ...columns,
        images: newImages,
      },
    });
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
    onDataChange?.({
      matches: newMatches,
      columns: newColumns,
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
        setColorPickerCoordinates({
          x: 0,
          y: 0,
        });
        setColorIndexToChange(null);
      }
    };

    document.body.addEventListener("click", onClick);

    return () => {
      document.body.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "game-block border-4 border-[#2b7fff] flex justify-center gap-x-[250px] relative py-4",
        {
          "border-none": isPdfGenerating,
        }
      )}
    >
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
                className="cursor-pointer size-40 rounded-full bg-[#0000001A] relative group"
                onClick={() => {
                  if (!isEditable) return;
                  chooseColor(index);
                }}
              >
                {roles?.includes(UserRoles.TEACHER) && isEditable ? (
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
              className="cursor-pointer size-40 rounded-full relative group flex justify-center items-center"
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
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
                <span
                  className="opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    chooseColor(index, color);
                  }}
                >
                  <Image
                    src="/assets/icons/gear.svg"
                    alt="gear icon"
                    width={16}
                    height={16}
                    className="fill-white"
                  />
                </span>
              ) : null}
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
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
        {roles?.includes(UserRoles.TEACHER) &&
        isEditable &&
        columns.colors.length < 5 ? (
          <li
            className="bg-[#0000003A] size-40 rounded-full cursor-pointer text-white"
            onClick={addRow}
          >
            <div className="text-9xl size-full flex justify-center items-center translate-x-[1px] translate-y-[-10px]">
              +
            </div>
          </li>
        ) : null}
      </ul>
      <ul className="flex flex-col gap-y-4">
        {columns.images.map((image, index) => {
          if (image === null) {
            return (
              <li
                key={index}
                className="cursor-pointer size-40 rounded-full bg-[#0000001A] relative group"
                onClick={() => {
                  if (!isEditable) return;
                  chooseImage(index);
                }}
              >
                {roles?.includes(UserRoles.TEACHER) && isEditable ? (
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
              className="cursor-pointer size-40 rounded-full relative group"
              key={index}
              ref={(ref) => {
                if (ref) {
                  imageRefs.current[image] = ref;
                }
              }}
            >
              <img
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
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
                <span
                  className="absolute top-0 -right-[20px] opacity-0 transition-all group-hover:opacity-100"
                  onClick={() => deleteRow(index)}
                >
                  &#x2715;
                </span>
              ) : null}
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
                <span
                  className="text-white opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    chooseImage(index);
                  }}
                >
                  <img
                    src="/assets/icons/gear.svg"
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
        {roles?.includes(UserRoles.TEACHER) &&
        isEditable &&
        columns.images.length < 5 ? (
          <li
            className="bg-[#0000003A] size-40 rounded-full cursor-pointer text-white"
            onClick={addRow}
          >
            <div className="text-9xl size-full flex justify-center items-center translate-x-[1px] translate-y-[-10px]">
              +
            </div>
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
          className="absolute -translate-y-[50%] z-30"
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
              onDataChange?.({
                matches: newMatches,
                columns: { ...columns, colors: newColors },
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
