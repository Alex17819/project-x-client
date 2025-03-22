"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/actions/auth/schema";
import { AuthApi } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export const RegisterForm = ({
  setAuthType,
}: {
  setAuthType: Dispatch<SetStateAction<"login" | "register">>;
}) => {
  const router = useRouter();
  const {
    register: registerInput,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(registerFormSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    event?.preventDefault();
    setIsLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      credentials: "include",
    });
    const body = await res.json();
    setIsLoading(false);
    if (!res.ok) {
      toast.error(body.message);
      reset();
    }
    toast.success(body.message);
    router.push("/dashboard");
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
          className="border outline-none"
        />
        {errors?.email && (
          <span className="text-red-500">{errors.email?.message}</span>
        )}
        <label htmlFor="password">Password</label>
        <input
          {...registerInput("password", { required: true })}
          type="text"
          name="password"
          id="password"
          placeholder="Password"
          className="border outline-none"
        />
        {errors?.password && (
          <span className="text-red-500">{errors.password?.message}</span>
        )}
        <label htmlFor="password-confirmation">Password confirmation</label>
        <input
          {...registerInput("passwordConfirmation", { required: true })}
          type="text"
          placeholder="Password confirmation"
          className="border outline-none"
        />
        {errors?.passwordConfirmation && (
          <span className="text-red-500">
            {errors.passwordConfirmation?.message}
          </span>
        )}
        <button
          type="submit"
          className="cursor-pointer border px-2"
          disabled={isLoading}
        >
          Register
        </button>
      </form>
      <span>
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setAuthType("login")}
        >
          Login&nbsp;
        </span>
        now
      </span>
    </div>
  );
};
