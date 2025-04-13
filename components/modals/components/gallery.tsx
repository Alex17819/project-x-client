"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { FilesApi } from "@/api/files";
import { Button } from "@/components/ui/button";

import { Overlay } from "../common";
import axios from "axios";
import { Input } from "@/components/ui/input";

export const GalleryModal = ({
  onClose,
  onClick,
}: {
  onClose: VoidFunction;
  onClick?: (img: string) => void;
}) => {
  const [images, setImages] = useState<{ link: string }[]>([]);
  const [tabOpen, setTabOpen] = useState<"images" | "ai">("images");
  const [value, setValue] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getImages = async () => {
    const res = await FilesApi.getFiles();

    if (res.data.length === 0) {
      toast.error("No images found");
      return;
    }

    setImages(res.data);

    return res.data;
  };

  useEffect(() => {
    getImages();

    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const generateImage = async () => {
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    const formData = new FormData();
    formData.set("prompt", value);

    try {
      const res = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        }
      );

      setUrl(res.data.image);
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("❌ Canceled request");
        return;
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async () => {
    setIsImageUploading(true);

    try {
      await FilesApi.uploadFile({
        base64: url,
        filename: filename + ".png",
      });

      const newImages = await getImages();
      setImages(newImages);

      toast.success("Image uploaded successfully.");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      console.error(e);
      toast.error(e.response.data.message);
    } finally {
      setIsImageUploading(false);
    }
  };

  const uploadUserImage = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(",")[1]; // remove data:image/png;base64,...
      if (!base64) return;

      try {
        await FilesApi.uploadFile({
          base64,
          filename: file.name,
        });
        toast.success("Image uploaded!");
        const newImages = await getImages();
        setImages(newImages);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (e.status === 409) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          toast.error(e.response.data.message);
          return;
        }
        toast.error("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Overlay onClose={onClose}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="w-full max-h-full rounded-md bg-white flex-col pb-4 relative overflow-auto">
        <div className="sticky top-0 bg-white p-4 z-10">
          <button
            type="button"
            className="cursor-pointer absolute right-4 top-4"
            onClick={onClose}
          >
            &#x2715;
          </button>
          <ul className="flex gap-x-2">
            <li onClick={() => setTabOpen("images")}>
              <Button>Images</Button>
            </li>
            <li onClick={() => uploadUserImage()}>
              <Button>Upload image</Button>
            </li>
            <li onClick={() => setTabOpen("ai")}>
              <Button>Generate AI-image</Button>
            </li>
          </ul>
        </div>
        <div className="relative px-4">
          {!url && isLoading ? (
            <div className="absolute top-0 left-0 size-full flex justify-center items-center bg-white">
              <div className="loader" />
            </div>
          ) : null}
          {tabOpen === "images" ? (
            <>
              <h3>Your images</h3>
              <ul className="my-grid grid xxs:grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {images.map((image, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        onClick?.(image.link);
                      }}
                      className="cursor-pointer h-[200px] overflow-hidden"
                    >
                      <Image
                        src={image.link}
                        alt="image"
                        width={200}
                        height={200}
                        className="size-full object-cover"
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div>
              <textarea
                placeholder="Enter your prompt..."
                className="border size-full outline-none p-2 resize-none"
                name="ai-prompt"
                id="ai-prompt"
                onChange={handleChange}
                value={value}
              />
              <Button
                type="button"
                className="w-full"
                onClick={generateImage}
                disabled={isLoading}
              >
                Generate
              </Button>
              {url ? (
                <div className="flex flex-col mt-4 items-center gap-y-2 size-full">
                  {url && isLoading ? (
                    <div className="absolute top-0 left-0 size-full flex justify-center items-center bg-white">
                      <div className="loader" />
                    </div>
                  ) : null}
                  <Image
                    src={`data:image/png;base64,${url}`}
                    alt="img"
                    width={500}
                    height={500}
                  />
                  <Button
                    disabled={!filename || isImageUploading}
                    onClick={
                      !filename || isImageUploading ? () => {} : uploadImage
                    }
                    className="w-full"
                  >
                    Save image
                  </Button>
                  <Input
                    type="text"
                    placeholder="Enter filename..."
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full"
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
};
