import { ReactNode } from "react";

export const Overlay = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: VoidFunction;
}) => {
  return (
    <div
      className="bg-black/50 fixed top-0 left-0 inset-0 size-full p-[10%] z-100"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center items-center size-full"
      >
        {children}
      </div>
    </div>
  );
};
