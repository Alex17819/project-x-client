import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

import { clsx } from "clsx";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
}

export const Button = ({ children, className, ...rest }: ButtonProps) => (
  <button
    className={clsx(
      "border cursor-pointer py-1 px-2 h-fit hover:bg-black hover:text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:hover:text-black",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
