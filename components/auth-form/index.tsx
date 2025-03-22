"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export const AuthForm = () => {
  const [authType, setAuthType] = useState<"login" | "register">("login");

  return authType === "login" ? (
    <LoginForm setAuthType={setAuthType} />
  ) : (
    <RegisterForm setAuthType={setAuthType} />
  );
};
