"use client";

import { createPortal } from "react-dom";
import { FC } from "react";

import { useLockBodyScroll } from "@/hooks";

import { GalleryModal } from "./components/gallery";

type ModalProps = {
  onClose: VoidFunction;
  onClick?: (igm: string) => void;
};

const Modals: Record<string, FC<ModalProps>> = {
  gallery: GalleryModal,
};

export const Modal = ({
  type,
  isOpen,
  onClose,
  onClick,
}: {
  type: keyof typeof Modals;
  isOpen: boolean;
  onClose: VoidFunction;
  onClick?: (igm: string) => void;
}) => {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const Component = Modals[type];

  return createPortal(
    <Component onClose={onClose} onClick={onClick} />,
    document.body
  );
};
