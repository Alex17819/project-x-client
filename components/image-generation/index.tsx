"use client";

import { ChangeEvent, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./index.module.css";
import { FilesApi } from "@/api/files";
import { toast } from "react-toastify";

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
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      setIsImageUploading(false);
    }
  };

  const getImages = async () => {
    const res = await FilesApi.getFiles();
    setImages(res.data);
  };

  console.log(images);

  return (
    <div className="flex flex-col items-center gap-y-2">
      <div>
        <button className="p-2 border cursor-pointer" onClick={getImages}>
          Fetch existing images
        </button>
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
        className="border size-50 outline-none"
        name="ai-prompt"
        id="ai-prompt"
        onChange={handleChange}
        value={value}
      />
      <button
        className="border cursor-pointer"
        type="button"
        onClick={onSubmit}
      >
        Generate
      </button>
      <div className="relative w-[500px] h-[500px] flex justify-center items-center">
        {isLoading ? (
          <div className="absolute top-0 left-0 size-full flex justify-center items-center bg-gray-500">
            <div className={styles.loader} />
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
            <button
              className="border cursor-pointer p-2 disabled:bg-gray-300 hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
              disabled={!filename || isImageUploading}
              onClick={!filename || isImageUploading ? () => {} : uploadImage}
            >
              Save image
            </button>
            <input
              className="p-2 outline-none border hover:bg-gray-300 transition-colors"
              type="text"
              placeholder="Enter filename..."
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
