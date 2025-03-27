"use client";

import { api } from "@/api/axios";
import { API_ROUTES } from "@/api/routes";

export class AuthApi {
  static async register(body: {
    email: string;
    password: string;
    role: "TEACHER" | "USER";
  }) {
    try {
      return await api.post(API_ROUTES.register, body);
    } catch (err: any) {
      return err.response || "Server error";
    }
  }

  static async login(body: { email: string; password: string }) {
    try {
      return await api.post(API_ROUTES.login, body);
    } catch (err: any) {
      return err.response || "Server error";
    }
  }
}
