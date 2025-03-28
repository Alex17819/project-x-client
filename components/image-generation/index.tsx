"use client";

import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";

import { FilesApi } from "@/api/files";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ImageGeneration = () => {
  const [url, setUrl] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [images, setImages] = useState<{ link: string }[]>([]);

  const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = async () => {
    if (url) setUrl("");
    setIsLoading(true);
    const formData = new FormData();
    formData.set("prompt", value);

    const res = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    setUrl(res.data.image);
    setIsLoading(false);
  };

  const uploadImage = async () => {
    setIsImageUploading(true);

    try {
      await FilesApi.uploadFile({
        base64: url,
        filename: filename + ".png",
      });

      toast.success("Image uploaded successfully.");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      console.error(e);
      toast.error(e.response.data.message);
    } finally {
      setIsImageUploading(false);
    }
  };

  const getImages = async () => {
    const res = await FilesApi.getFiles();

    if (res.data.length === 0) {
      toast.error("No images found");
      return;
    }

    setImages(res.data);
  };

  return (
    <div className="flex flex-col items-center gap-y-2">
      <div className="flex flex-col items-center gap-y-2">
        <Button className="w-[200px]" onClick={getImages}>
          Fetch existing images
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {images.map((item, index) => (
            <Image
              key={index}
              src={item.link}
              alt="ai-image"
              width={200}
              height={200}
            />
          ))}
        </div>
      </div>
      <textarea
        placeholder="Enter your prompt..."
        className="border size-50 outline-none p-2"
        name="ai-prompt"
        id="ai-prompt"
        onChange={handleChange}
        value={value}
      />
      <Button type="button" onClick={onSubmit} disabled={!value}>
        Generate
      </Button>
      {isLoading || url ? (
        <div className="relative w-[500px] min-h-[500px] size-full flex justify-center items-center">
          {isLoading ? (
            <div className="absolute top-0 left-0 size-full flex justify-center items-center bg-gray-500">
              <div className="loader" />
            </div>
          ) : null}
          {url ? (
            <div className="flex flex-col gap-y-2 size-full">
              <Image
                src={`data:image/png;base64,${url}`}
                alt="img"
                width={500}
                height={500}
              />
              <Button
                disabled={!filename || isImageUploading}
                onClick={!filename || isImageUploading ? () => {} : uploadImage}
              >
                Save image
              </Button>
              <Input
                type="text"
                placeholder="Enter filename..."
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
