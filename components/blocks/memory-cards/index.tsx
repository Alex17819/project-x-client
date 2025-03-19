"use client";

import { useState } from "react";
import { clsx } from "clsx";

// Fisher-Yates (Durstenfeld shuffle)
const generateMatrix = (rows: number, cols: number) => {
  if ((rows * cols) % 2 !== 0) {
    throw new Error("Количество ячеек должно быть чётным!");
  }

  const pairsCount = (rows * cols) / 2;
  const values = Array.from({ length: pairsCount }, (_, i) => i + 1).flatMap(
    (v) => [v, v]
  );

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  const matrix: { value: number; isMatched: boolean }[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(
      values
        .slice(i * cols, (i + 1) * cols)
        .map((value) => ({ value, isMatched: false }))
    );
  }

  return matrix;
};

const matrix = generateMatrix(4, 4);

export const MemoryCards = () => {
  const [state, setState] = useState(() => matrix);
  const [selected, setSelected] = useState<(null | number)[][]>([
    [null, null],
    [null, null],
  ]);
  const [isBlocked, setIsBlocked] = useState(false);

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

              return (
                <li
                  key={itemIndex}
                  className={clsx(
                    "size-10 flex justify-center items-center border cursor-pointer bg-black transition-colors duration-500 select-none",
                    {
                      "bg-white": isSelected,
                    }
                  )}
                  onClick={
                    isBlocked || isSelected
                      ? () => {}
                      : () => handleChange(rowIndex, itemIndex)
                  }
                >
                  {isSelected ? item.value : ""}
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
};
