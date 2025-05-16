"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { AuthApi } from "@/api/auth";
import { registerFormSchema } from "./schema";

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
    router.push("/projects");
  };

  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 justify-center items-center"
      >
        <label htmlFor="email">Email</label>
        <input
          {...registerInput("email", { required: true })}
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="border outline-none px-2"
        />
        {errors?.email && (
          <span className="text-red-500">{errors.email?.message}</span>
        )}
        <label htmlFor="password">Password</label>
        <input
          {...registerInput("password", { required: true })}
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border outline-none px-2"
        />
        {errors?.password && (
          <span className="text-red-500">{errors.password?.message}</span>
        )}
        <label htmlFor="password-confirmation">Password confirmation</label>
        <input
          {...registerInput("passwordConfirmation", { required: true })}
          type="password"
          placeholder="Password confirmation"
          className="border outline-none px-2"
        />
        {errors?.passwordConfirmation && (
          <span className="text-red-500">
            {errors.passwordConfirmation?.message}
          </span>
        )}
        <div className="flex gap-x-2 items-center">
          <label htmlFor="isTeacher" className="flex gap-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...registerInput("isTeacher")}
              name="isTeacher"
              id="isTeacher"
            />
            Create account as a teacher
          </label>
        </div>
        <button
          type="submit"
          className="cursor-pointer border px-2 disabled:bg-gray-300 hover:bg-black hover:text-white transition-colors"
          disabled={isLoading}
        >
          Register
        </button>
      </form>
      <span>
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          Login&nbsp;
        </Link>
        now
      </span>
    </div>
  );
};
