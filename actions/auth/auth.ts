"use server";

import {
  FormState,
  loginFormSchema,
  RegisterFormSchema,
} from "@/actions/auth/schema";
import { AuthApi } from "@/api/auth";

export const login = async (state: FormState, formData: FormData) => {
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const res = await AuthApi.login({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  console.log(res);

  console.log("SUCCESS LOGIN");
};

export const register = async (state: FormState, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = RegisterFormSchema.safeParse({
    email,
    password,
    passwordConfirmation: formData.get("password-confirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const res = await AuthApi.register({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  console.log(res);

  console.log("SUCCESS REGISTER");
};
