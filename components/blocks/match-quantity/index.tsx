"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import { clsx } from "clsx";

import { Modal } from "@/components/modals/modal";
import { nanoid } from "nanoid";

const roles: ("USER" | "TEACHER")[] = ["USER", "TEACHER"];

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface State {
  images: (string | null)[];
  numbers: { id: string; value: number | null }[];
}

interface Props {
  onDataChange?: (data: {
    lines?: Line[];
    matches?: Record<string, string>;
    state?: State;
  }) => void;
  data?: {
    lines?: Line[];
    matches?: Record<string, string>;
    state?: State;
  };
  isEditable?: boolean;
}

export const MatchQuantity = ({ onDataChange, data, isEditable }: Props) => {
  const [state, setState] = useState<State>({
    images: [null],
    numbers: [
      {
        value: 0,
        id: nanoid(),
      },
    ],
  });
  const [selected, setSelected] = useState({
    image: null,
    number: null,
  });
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [img, setImg] = useState("");
  const [imageIndexToChange, setImageIndexToChange] = useState<number | null>(
    null
  );
  const [editableIndex, setEditableIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const numberRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!data) return;
    if (data.matches) setMatches(data?.matches);
    if (data.state) setState(data?.state);
    if (data.lines) setLines(data?.lines);
  }, [data]);

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

    const newLinesFiltered = newLines.filter((line) => line !== null);

    setLines(newLinesFiltered);
    onDataChange?.({
      lines: newLinesFiltered,
    });
  }, [matches]);

  const handleSelect = (type: "image" | "number", value: string) => {
    setSelected((prevState) => {
      const newSelected = {
        ...prevState,
        [type]: prevState[type] === value ? null : value,
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
          onDataChange?.({
            matches: updatedMatches,
          });
          return updatedMatches;
        });

        return { image: null, number: null };
      }

      return newSelected;
    });
  };

  const addRow = () => {
    setState((prevState) => {
      const newRow = {
        images: [...prevState.images, null],
        numbers: [
          ...prevState.numbers,
          {
            value: 0,
            id: nanoid(),
          },
        ],
      };
      onDataChange?.({
        state: newRow,
      });
      return newRow;
    });
  };

  const openGalleryModal = (index: number) => {
    setImageIndexToChange(index);
    setIsGalleryModalOpen(true);
  };

  const onChange = (index: number, value: string) => {
    const newValue = value === "" ? null : Number(value);

    setState((prevState) => {
      const newState = {
        ...prevState,
        numbers: prevState.numbers.map((number, numberIndex) =>
          numberIndex === index ? { ...number, value: newValue } : { ...number }
        ),
      };
      onDataChange?.({
        state: newState,
      });
      return newState;
    });
  };

  useEffect(() => {
    if (state.images.includes(img)) {
      toast.error("Duplicated image");
      setImg("");
      setImageIndexToChange(null);
      return;
    }

    if (img === "" || imageIndexToChange === null) return;

    setState((prevState) => {
      const newState = {
        ...prevState,
        images: prevState.images.map((image, index) => {
          if (imageIndexToChange === index) {
            return img;
          }

          return image;
        }),
      };
      onDataChange?.({ state: newState });
      return newState;
    });

    setImg("");
    setImageIndexToChange(null);
  }, [img, imageIndexToChange, state.images]);

  const deleteRow = (index: number) => {
    if (state.images.length === 1 || state.numbers.length === 1) return;

    const newState = {
      images: [...state.images],
      numbers: [...state.numbers],
    };

    newState.images = newState.images.filter(
      (_, rowIndex) => rowIndex !== index
    );
    newState.numbers = newState.numbers.filter(
      (_, rowIndex) => rowIndex !== index
    );

    if (selected.number === index || selected.image === index) {
      setSelected({
        number: null,
        image: null,
      });
    }

    const newMatches = {
      ...matches,
    };
    Object.entries(newMatches).forEach(([key, value]) => {
      if (
        !newState.numbers.find((el) => el.id === value) ||
        !newState.images.includes(key)
      ) {
        delete newMatches[key];
      }
    });
    setMatches(newMatches);
    setState(newState);
    onDataChange?.({
      matches: newMatches,
      state: newState,
    });
  };

  useEffect(() => {
    if (editableIndex !== null) {
      inputRefs.current[editableIndex]?.focus();
    }
  }, [editableIndex]);

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
        {state.images.map((image, index) => {
          if (image === null) {
            return (
              <li
                key={index}
                className="bg-black/30 size-20 rounded-full cursor-pointer flex justify-center
                items-center relative group"
                onClick={() => {
                  if (!isEditable) return;
                  openGalleryModal(index);
                }}
              >
                <Image
                  className="size-full rounded-full"
                  src="/assets/images/image-placeholder.jpg"
                  width={80}
                  height={80}
                  alt="animals"
                />
                {roles.includes("TEACHER") && isEditable ? (
                  <span
                    className="absolute top-0 -right-[20px] text-black opacity-0 transition-all group-hover:opacity-100"
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

          return (
            <li
              ref={(ref) => {
                if (ref) imageRefs.current[image] = ref;
              }}
              key={index}
              className={clsx(
                "cursor-pointer size-20 rounded-full border border-2 group relative",
                {
                  "border-blue-500": selected.image === image,
                }
              )}
              onClick={() => handleSelect("image", image)}
            >
              <Image
                className="size-full rounded-full object-cover"
                src={image}
                width={80}
                height={80}
                alt="animals"
              />
              {roles.includes("TEACHER") && isEditable ? (
                <span
                  className="absolute top-0 -right-[20px] text-black opacity-0 transition-all group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRow(index);
                  }}
                >
                  &#x2715;
                </span>
              ) : null}
              {roles.includes("TEACHER") && isEditable ? (
                <span
                  className="opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGalleryModal(index);
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
            </li>
          );
        })}
        {roles.includes("TEACHER") && isEditable && state.images.length < 5 ? (
          <li
            className="bg-black/30 size-20 rounded-full cursor-pointer text-[40px] text-white flex justify-center items-center"
            onClick={addRow}
          >
            +
          </li>
        ) : null}
      </ul>
      <ul className="flex flex-col gap-y-2">
        {state.numbers.map((number, index) => {
          return (
            <li
              ref={(ref) => {
                if (ref) numberRefs.current[number.id] = ref;
              }}
              key={index}
              className={clsx(
                "cursor-pointer size-20 rounded-full border-2 flex justify-center items-center group relative text-3xl",
                {
                  "border-blue-500": selected.number === number.id,
                }
              )}
              onClick={() => handleSelect("number", number.id)}
            >
              {roles.includes("TEACHER") && isEditable ? (
                <>
                  <input
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="number"
                    className={clsx(
                      "size-full outline-none text-center text-3xl",
                      {
                        hidden: editableIndex !== index,
                      }
                    )}
                    value={number.value === null ? "" : number.value}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      onChange(index, e.target.value);
                    }}
                    onBlur={() => {
                      setEditableIndex(null);
                    }}
                  />
                  {editableIndex !== index ? (
                    <span className="text-3xl">{number.value}</span>
                  ) : null}
                  <span
                    className="absolute top-0 -right-[20px] text-black opacity-0 transition-all group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRow(index);
                    }}
                  >
                    &#x2715;
                  </span>
                  <span
                    className="opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditableIndex(index);
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
                </>
              ) : (
                number.value
              )}
            </li>
          );
        })}
        {roles.includes("TEACHER") && isEditable && state.numbers.length < 5 ? (
          <li
            className="bg-black/30 size-20 rounded-full cursor-pointer text-[40px] text-white flex justify-center items-center"
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
    </div>
  );
};
