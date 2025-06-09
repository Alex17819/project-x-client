"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { AuthApi } from "@/api/auth";
import { registerFormSchema } from "./schema";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@mui/material";
import { Button } from "@/components/ui/button";

type Inputs = {
  email: string;
  password: string;
  passwordConfirmation: string;
  isTeacher: boolean;
};

export const RegisterForm = () => {
  const router = useRouter();
  const {
    register: registerInput,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(registerFormSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const isTeacher = watch("isTeacher", false);

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    event?.preventDefault();
    setIsLoading(true);
    const res = await AuthApi.register({
      email: data.email,
      password: data.password,
      role: isTeacher ? "TEACHER" : "USER",
    });
    setIsLoading(false);
    if (res.status !== 201) {
      toast.error(res.data.message);
      reset();
      return;
    }
    toast.success(res.data.message);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 justify-center items-center"
      >
        <Input
          {...registerInput("email", { required: true })}
          type="text"
          name="email"
          id="email"
          label="Email"
        />
        {errors?.email && (
          <span className="text-red-500">{errors.email?.message}</span>
        )}
        <Input
          {...registerInput("password", { required: true })}
          type="password"
          name="password"
          id="password"
          label="Parola"
        />
        {errors?.password && (
          <span className="text-red-500">{errors.password?.message}</span>
        )}
        <Input
          {...registerInput("passwordConfirmation", { required: true })}
          type="password"
          label="Confirmare parola"
        />
        {errors?.passwordConfirmation && (
          <span className="text-red-500">
            {errors.passwordConfirmation?.message}
          </span>
        )}
        <div className="flex gap-x-2 items-center">
          <label
            htmlFor="isTeacher"
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <Checkbox
              {...registerInput("isTeacher")}
              name="isTeacher"
              id="isTeacher"
            />
            Creați un cont ca profesor
          </label>
        </div>
        <Button
          type="submit"
          // className="cursor-pointer border px-2 disabled:bg-gray-300 hover:bg-black hover:text-white transition-colors"
          disabled={isLoading}
        >
          Înregistrați-vă
        </Button>
      </form>
      <span>
        Aveți deja un cont?{" "}
        <Link
          href="/login"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          Logare&nbsp;
        </Link>
        acum
      </span>
    </div>
  );
};
