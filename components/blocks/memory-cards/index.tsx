"use client";

import { useState } from "react";
import { clsx } from "clsx";

import { generateMatrix } from "@/utils";
import { Button } from "@/components/ui/button";

const roles: ("USER" | "TEACHER")[] = ["USER", "TEACHER"];

export const MemoryCards = () => {
  const [state, setState] = useState(generateMatrix(4, 4));
  const [selected, setSelected] = useState<(null | number)[][]>([
    [null, null],
    [null, null],
  ]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (rowIndex: number, itemIndex: number) => {
    setSelected((prevState) => {
      const updatedState = prevState.map((row) => [...row]);

      if (prevState[0].every((item) => item === null)) {
        updatedState[0][0] = rowIndex;
        updatedState[0][1] = itemIndex;
        return updatedState;
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

      return updatedState;
    });
  };

  return (
    <div className="flex flex-col items-center gap-y-2">
      {state.map((row, rowIndex) => {
        return (
          <ul key={rowIndex} className="flex gap-2">
            {row.map((item, itemIndex) => {
              const isMatched = item.isMatched;

              const isSelected =
                isMatched ||
                (selected[0][0] === rowIndex && selected[0][1] === itemIndex) ||
                (selected[1][0] === rowIndex && selected[1][1] === itemIndex);

              const showCard = isVisible && roles.includes("TEACHER");

              return (
                <li
                  key={itemIndex}
                  className={clsx(
                    "size-10 flex justify-center items-center border cursor-pointer bg-black transition-colors duration-500 select-none",
                    {
                      "bg-white": showCard || isSelected,
                    }
                  )}
                  onClick={
                    showCard || isBlocked || isSelected
                      ? () => {}
                      : () => handleChange(rowIndex, itemIndex)
                  }
                >
                  {showCard || isSelected ? item.value : ""}
                </li>
              );
            })}
          </ul>
        );
      })}
      {roles.includes("TEACHER") ? (
        <>
          <Button onClick={() => setIsVisible((prevState) => !prevState)}>
            {isVisible ? "Hide" : "Show"} all values
          </Button>
          <Button onClick={() => setState(generateMatrix(4, 4))}>
            Shuffle the cards
          </Button>
        </>
      ) : null}
    </div>
  );
};
