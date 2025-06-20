"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import { clsx } from "clsx";

import { Modal } from "@/components/modals/modal";
import { nanoid } from "nanoid";
import { UserRoles } from "@/types/user";

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
  roles?: UserRoles[];
  isPdfGenerating?: boolean;
}

export const MatchQuantity = ({
  onDataChange,
  data,
  isEditable = false,
  roles,
  isPdfGenerating = false,
}: Props) => {
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
    const newSelected = {
      ...selected,
      [type]: selected[type] === value ? null : value,
    };

    if (newSelected.image !== null && newSelected.number !== null) {
      const updatedMatches = { ...matches };

      Object.entries(matches).forEach(([image, number]) => {
        if (image === newSelected.image || number === newSelected.number) {
          delete updatedMatches[image];
        }
      });

      updatedMatches[newSelected.image!] = newSelected.number!;
      onDataChange?.({
        matches: updatedMatches,
      });
      setMatches(updatedMatches);

      setSelected({ image: null, number: null });
      return;
    }

    setSelected(newSelected);
  };

  const addRow = () => {
    const newRow = {
      images: [...state.images, null],
      numbers: [
        ...state.numbers,
        {
          value: 0,
          id: nanoid(),
        },
      ],
    };
    onDataChange?.({
      state: newRow,
    });
    setState(newRow);
  };

  const openGalleryModal = (index: number) => {
    setImageIndexToChange(index);
    setIsGalleryModalOpen(true);
  };

  const onChange = (index: number, value: string) => {
    const newValue = value === "" ? null : Number(value);
    const newState = {
      ...state,
      numbers: state.numbers.map((number, numberIndex) =>
        numberIndex === index ? { ...number, value: newValue } : { ...number }
      ),
    };
    onDataChange?.({
      state: newState,
    });
    setState(newState);
  };

  useEffect(() => {
    if (state.images.includes(img)) {
      toast.error("Duplicated image");
      setImg("");
      setImageIndexToChange(null);
      return;
    }

    if (img === "" || imageIndexToChange === null) return;

    const newState = {
      ...state,
      images: state.images.map((image, index) => {
        if (imageIndexToChange === index) {
          return img;
        }

        return image;
      }),
    };
    onDataChange?.({ state: newState });
    setState(newState);
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
    <div
      ref={containerRef}
      className={clsx(
        "game-block border-4 border-[#2b7fff] relative flex justify-center gap-x-[250px] py-4",
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
                className="bg-[#0000003A] size-40 rounded-full cursor-pointer flex justify-center
                items-center relative group"
                onClick={() => {
                  if (!isEditable) return;
                  openGalleryModal(index);
                }}
              >
                <img
                  className="size-full rounded-full"
                  src="/assets/images/image-placeholder.jpg"
                  width={80}
                  height={80}
                  alt="animals"
                />
                {roles?.includes(UserRoles.TEACHER) && isEditable ? (
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
                "cursor-pointer size-40 rounded-full border border-2 group relative",
                {
                  "border-[#2b7fff]": selected.image === image,
                }
              )}
              onClick={() => handleSelect("image", image)}
            >
              <img
                className="size-full rounded-full object-cover"
                src={image}
                width={80}
                height={80}
                alt="animals"
              />
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
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
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
                <span
                  className="opacity-0 transition-all group-hover:opacity-100 absolute top-[20px] -right-[22px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGalleryModal(index);
                  }}
                >
                  <img
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
        {roles?.includes(UserRoles.TEACHER) &&
        isEditable &&
        state.images.length < 5 ? (
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
      <ul className="flex flex-col gap-y-2">
        {state.numbers.map((number, index) => {
          return (
            <li
              ref={(ref) => {
                if (ref) numberRefs.current[number.id] = ref;
              }}
              key={index}
              className={clsx(
                "cursor-pointer size-40 rounded-full border-2 flex justify-center items-center group relative",
                {
                  "border-[#2b7fff]": selected.number === number.id,
                }
              )}
              onClick={() => handleSelect("number", number.id)}
            >
              {roles?.includes(UserRoles.TEACHER) && isEditable ? (
                <>
                  <input
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="number"
                    className={clsx(
                      "size-full outline-none text-center text-7xl",
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
                    <span className="text-7xl">{number.value}</span>
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
                    <img
                      src="/assets/icons/gear.svg"
                      alt="gear icon"
                      width={16}
                      height={16}
                      className="fill-white"
                    />
                  </span>
                </>
              ) : (
                <div className="text-7xl size-full flex justify-center items-center tabular-nums">
                  <span
                    className={clsx({
                      "-translate-y-[30px]": isPdfGenerating,
                    })}
                  >
                    {number.value}
                  </span>
                </div>
              )}
            </li>
          );
        })}
        {roles?.includes(UserRoles.TEACHER) &&
        isEditable &&
        state.numbers.length < 5 ? (
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
    </div>
  );
};
