"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UserRoles } from "@/types/user";

interface Props {
  onDataChange?: (data: { state?: (number | null)[][][] }) => void;
  data?: {
    state?: (number | null)[][][];
  };
  roles?: UserRoles[];
  isEditable?: boolean;
}

export const NumberNeighbor = ({
  roles,
  onDataChange,
  data,
  isEditable,
}: Props) => {
  const [state, setState] = useState<(number | null)[][][]>([
    [[null, null, null]],
  ]);

  useEffect(() => {
    if (!data) return;
    if (data.state) setState(data.state);
  }, [data]);

  const onChange = ({
    columnIndex,
    rowIndex,
    inputIndex,
    value,
  }: {
    columnIndex: number;
    rowIndex: number;
    inputIndex: number;
    value: string;
  }) => {
    const newState = state.map((column, indexColumn) => {
      if (indexColumn === columnIndex) {
        return column.map((row, indexRow) => {
          if (rowIndex === indexRow) {
            if (value.length > 2) {
              return row;
            }
            if (!/^[0-9]*$/.test(value)) {
              return row;
            }
            if (inputIndex === 0) {
              return [value === "" ? null : Number(value), row[1], row[2]];
            }
            if (inputIndex === 2) {
              return [row[0], row[1], value === "" ? null : Number(value)];
            }
            if (
              inputIndex === 1 &&
              roles?.includes(UserRoles.TEACHER) &&
              isEditable
            ) {
              return [row[0], value === "" ? null : Number(value), row[2]];
            }
          }

          return row;
        });
      }

      return column;
    });
    onDataChange?.({
      state: newState,
    });
    setState(newState);
  };

  const addRow = (columnIndex: number) => {
    const newState = state.map((column, index) => {
      if (columnIndex === index) {
        return [...column, [null, null, null]];
      }
      return column;
    });
    onDataChange?.({
      state: newState,
    });
    setState(newState);
  };

  const addColumn = () => {
    const newState = [...state, [[null, null, null]]];
    onDataChange?.({
      state: newState,
    });
    setState(newState);
  };

  const deleteItem = ({
    columnIndex,
    rowIndex,
  }: {
    columnIndex: number;
    rowIndex: number;
  }) => {
    const newState = state.map((column, indexColumn) => {
      if (indexColumn === columnIndex) {
        return column.filter((_, indexRow) => indexRow !== rowIndex);
      }
      return column;
    });
    const cleanedState = newState.filter((column) => column.length > 0);
    if (cleanedState.length === 0) return state;
    onDataChange?.({
      state: cleanedState,
    });
    setState(cleanedState);
  };

  return (
    <div className="flex gap-x-5">
      {state.map((column, columnIndex) => {
        return (
          <div key={columnIndex} className="flex gap-5">
            <div className="flex flex-col gap-y-2">
              {column.map((row, rowIndex) => {
                return (
                  <div
                    key={rowIndex}
                    className="relative flex flex-col gap-y-2 group"
                  >
                    <div className="relative flex justify-center items-center">
                      {row.map((number, inputIndex) => {
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
                              type="text"
                              className="relative text-red-500 text-[24px] size-15 text-center outline-none z-2"
                              value={number ?? ""}
                              onChange={(e) =>
                                onChange({
                                  columnIndex,
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
                    {rowIndex === column.length - 1 &&
                    roles?.includes(UserRoles.TEACHER) &&
                    isEditable &&
                    column.length < 5 ? (
                      <div
                        className="text-white bg-black/30 max-w-[188px] h-[60px] rounded-lg cursor-pointer flex justify-center items-center"
                        onClick={() => addRow(columnIndex)}
                      >
                        Adăugați rând
                      </div>
                    ) : null}
                    {roles?.includes(UserRoles.TEACHER) && isEditable ? (
                      <span
                        className="absolute top-0 -right-[10px] text-black opacity-0 transition-all group-hover:opacity-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem({ columnIndex, rowIndex });
                        }}
                      >
                        &#x2715;
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {columnIndex === state.length - 1 &&
            roles?.includes(UserRoles.TEACHER) &&
            isEditable &&
            state.length < 3 ? (
              <div
                className="text-white bg-black/30 w-[188px] max-h-[60px] rounded-lg cursor-pointer flex justify-center items-center"
                onClick={addColumn}
              >
                Adăugați coloana
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
