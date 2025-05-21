"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { AuthApi } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginFormSchema } from "./schema";

interface Inputs {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginFormSchema),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    event?.preventDefault();
    setIsLoading(true);
    const res = await AuthApi.login(data);
    setIsLoading(false);
    if (res.status >= 400) {
      toast.error(res.data.message);
      reset();
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 justify-center items-center"
      >
        <label htmlFor="email">Email</label>
        <Input
          {...register("email", { required: true })}
          type="text"
          name="email"
          id="email"
          placeholder="Email"
        />
        {errors?.email && (
          <span className="text-red-500">{errors.email?.message}</span>
        )}
        <label htmlFor="password">Parola</label>
        <Input
          {...register("password", { required: true })}
          type="password"
          name="password"
          id="password"
          placeholder="Parola"
          className="border outline-none px-2"
        />
        {errors?.password && (
          <span className="text-red-500">{errors.password?.message}</span>
        )}
        <Button type="submit" disabled={isLoading}>
          Logare
        </Button>
      </form>
      <span>
        Nu aveți un cont?{" "}
        <Link
          href="/register"
          className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
        >
          Înregistrați-vă
        </Link>
        &nbsp;acum
      </span>
    </div>
  );
};
