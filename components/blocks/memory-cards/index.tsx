"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

import { generateMatrix } from "@/utils";
import { Button } from "@/components/ui/button";
import { UserRoles } from "@/types/user";

interface Props {
  onDataChange?: (data: {
    state?: { value: number; isMatched: boolean }[][];
  }) => void;
  data?: {
    state?: { value: number; isMatched: boolean }[][];
  };
  isEditable?: boolean;
  roles?: UserRoles[];
  isPdfGenerating?: boolean;
}

export const MemoryCards = ({
  onDataChange,
  data,
  isEditable = false,
  roles,
  isPdfGenerating = false,
}: Props) => {
  const [state, setState] = useState<{ value: number; isMatched: boolean }[][]>(
    []
  );
  const [selected, setSelected] = useState<(null | number)[][]>([
    [null, null],
    [null, null],
  ]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!data) {
      const matrix = generateMatrix(4, 4);
      setState(matrix);
      onDataChange?.({
        state: matrix,
      });
      return;
    }
    if (data.state) setState(data.state);
  }, [data]);

  const handleChange = (rowIndex: number, itemIndex: number) => {
    const updatedState = selected.map((row) => [...row]);

    if (selected[0].every((item) => item === null)) {
      updatedState[0][0] = rowIndex;
      updatedState[0][1] = itemIndex;
      setSelected(updatedState);
      return;
    } else {
      setIsBlocked(true);
      updatedState[1][0] = rowIndex;
      updatedState[1][1] = itemIndex;

      if (
        state[updatedState[0][0]!][updatedState[0][1]!].value ===
        state[updatedState[1][0]!][updatedState[1][1]!].value
      ) {
        const newState = state.map((row) => [...row]);
        newState[updatedState[0][0]!][updatedState[0][1]!].isMatched = true;
        newState[updatedState[1][0]!][updatedState[1][1]!].isMatched = true;
        setState(newState);
        onDataChange?.({
          state: newState,
        });
        setTimeout(() => {
          setSelected([
            [null, null],
            [null, null],
          ]);
          setIsBlocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setSelected([
            [null, null],
            [null, null],
          ]);
          setIsBlocked(false);
        }, 1000);
      }
    }

    setSelected(updatedState);
  };

  const toggleAllMatched = () => {
    const allMatched = state.every((row) =>
      row.every((item) => item.isMatched)
    );
    const updatedState = state.map((row) =>
      row.map((item) => ({ ...item, isMatched: !allMatched }))
    );
    setState(updatedState);
    onDataChange?.({ state: updatedState });
  };

  return (
    <div
      className={clsx(
        "game-block border-4 border-[#2b7fff] flex flex-col items-center gap-y-2 py-4",
        {
          "border-none": isPdfGenerating,
        }
      )}
    >
      {state.map((row, rowIndex) => {
        return (
          <ul key={rowIndex} className="flex gap-2 text-8xl">
            {row.map((item, itemIndex) => {
              const isMatched = item.isMatched;

              const isSelected =
                isMatched ||
                (selected[0][0] === rowIndex && selected[0][1] === itemIndex) ||
                (selected[1][0] === rowIndex && selected[1][1] === itemIndex);

              const showCard =
                isVisible && roles?.includes(UserRoles.TEACHER) && isEditable;

              const isOpen = isPdfGenerating || showCard || isSelected;

              const isEven = item.value % 2 === 0;
              const isOdd = item.value % 2 !== 0;

              return (
                <li
                  key={itemIndex}
                  className={clsx(
                    "size-20 flex justify-center items-center border cursor-pointer bg-[#009966] transition-colors text-white duration-500 select-none tabular-nums",
                    {
                      "bg-[#fb2c36]": isOpen && isEven,
                      "bg-[#3E53A0]!": isOpen && isOdd,
                    }
                  )}
                  onClick={
                    showCard || isBlocked || isSelected
                      ? () => {}
                      : () => handleChange(rowIndex, itemIndex)
                  }
                >
                  <span
                    className={clsx({
                      "-translate-y-[40px]": isPdfGenerating,
                    })}
                  >
                    {isPdfGenerating || showCard || isSelected
                      ? item.value
                      : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      })}
      {roles?.includes(UserRoles.TEACHER) && isEditable ? (
        <>
          <Button onClick={() => setIsVisible((prevState) => !prevState)}>
            {isVisible ? "Ascunde" : "Afișați"} toate valorile
          </Button>
          <Button onClick={() => setState(generateMatrix(4, 4))}>
            Amestecați cărțile
          </Button>
          <Button onClick={toggleAllMatched}>
            Setează toate cărțile potrivite
          </Button>
        </>
      ) : null}
    </div>
  );
};
