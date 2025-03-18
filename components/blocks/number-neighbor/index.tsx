"use client";

import { useState } from "react";
import Image from "next/image";

export const NumberNeighbor = () => {
  const [state, setState] = useState([
    [null, 5, null],
    [null, 4, null],
  ]);

  const onChange = ({
    rowIndex,
    inputIndex,
    value,
  }: {
    rowIndex: number;
    inputIndex: number;
    value: string;
  }) => {
    setState((prevState) => {
      return prevState.map((row, indexRow) => {
        if (rowIndex === indexRow) {
          if (inputIndex === 0) {
            return [Number(value), row[1], row[2]];
          }
          if (inputIndex === 2) {
            return [row[0], row[1], Number(value)];
          }
        }

        return row;
      });
    });
  };

  return (
    <div className="flex flex-col gap-y-5">
      {state.map((item, rowIndex) => {
        return (
          <div className="flex gap-x-2" key={rowIndex}>
            {item.map((number, inputIndex) => {
              return (
                <div
                  key={inputIndex}
                  className="relative flex justify-center items-center"
                >
                  <Image
                    className="absolute top-0 left-0 object-cover"
                    src="/assets/images/flower2.png"
                    width={60}
                    height={60}
                    alt="flower"
                  />
                  <div className="absolute top-[50%] left-[50%] -translate-[50%] size-7 bg-yellow-400 rounded-full shadow-[0_0_20px_#fdc700]" />
                  <input
                    className="relative text-red-500 text-[24px] size-15 text-center outline-none z-2"
                    value={number ?? ""}
                    onChange={(e) =>
                      onChange({
                        rowIndex,
                        inputIndex,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
