import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

import { clsx } from "clsx";

export const Input = ({
  className,
  ...rest
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <input className={clsx("border outline-none px-2", className)} {...rest} />
);
