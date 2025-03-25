"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/actions/auth/schema";
import { AuthApi } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

export const LoginForm = ({
  setAuthType,
}: {
  setAuthType: Dispatch<SetStateAction<"login" | "register">>;
}) => {
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
    if (res.status >= 400 && res.status < 500) {
      toast.error(res.response.data.message);
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
        <input
          {...register("email", { required: true })}
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
          {...register("password", { required: true })}
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border outline-none"
        />
        {errors?.password && (
          <span className="text-red-500">{errors.password?.message}</span>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer border"
        >
          Login
        </button>
      </form>
      <span>
        Don&#39;t have an account?{" "}
        <span
          className={`text-blue-500 cursor-pointer`}
          onClick={() => setAuthType("register")}
        >
          Register
        </span>
        &nbsp;now
      </span>
    </div>
  );
};
