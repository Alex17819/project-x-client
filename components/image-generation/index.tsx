"use client";

import { ChangeEvent, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./index.module.css";

export const ImageGeneration = () => {
  const [url, setUrl] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = async () => {
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

  return (
    <div className="flex flex-col items-center gap-y-2">
      <textarea
        placeholder="Enter your prompt..."
        className="border size-50 outline-none"
        name=""
        id=""
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
      <div className="relative w-[500px] h-[500px]">
        {isLoading ? (
          <div className="absolute top-0 left-0 size-full flex justify-center items-center bg-gray-500">
            <div className={styles.loader} />
          </div>
        ) : null}
        {url ? (
          <Image
            src={`data:image/png;base64,${url}`}
            alt="img"
            width={500}
            height={500}
          />
        ) : null}
      </div>
    </div>
  );
};
