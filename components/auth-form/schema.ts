import { z } from "zod";

export const registerFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Vă rugăm să introduceți un e-mail valid." })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Să aibă cel puțin 8 caractere" })
      .max(20, { message: "Maxim 20 de caractere" })
      .regex(/[a-zA-Z]/, { message: "Să conțină cel puțin o literă" })
      .regex(/[0-9]/, { message: "Să conțină cel puțin un număr" })
      .trim(),
    passwordConfirmation: z.string(),
    isTeacher: z.boolean(),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        message: "Parola nu coincide",
        path: ["passwordConfirmation"],
      });
    }
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Vă rugăm să introduceți un e-mail valid." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Să aibă cel puțin 8 caractere" })
    .max(20, { message: "Maxim 20 de caractere" })
    .regex(/[a-zA-Z]/, { message: "Să conțină cel puțin o literă" })
    .regex(/[0-9]/, { message: "Să conțină cel puțin un număr" })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        passwordConfirmation?: string[];
      };
      message?: string;
    }
  | undefined;
