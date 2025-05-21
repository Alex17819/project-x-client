"use client";

import Link from "next/link";
import { api } from "@/api/axios";
import { UserRoles } from "@/types/user";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";

const menu = [
  {
    title: "Proiecte",
    link: "/dashboard",
    isAuth: true,
    roles: UserRoles.TEACHER,
  },
  {
    title: "Înregistrare",
    link: "/register",
  },
];

export const Header = () => {
  const isAuthenticated = useAuth();

  const { data: user } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 0,
    enabled: isAuthenticated === true,
  });

  return (
    <header className="bg-[#3E53A0] text-white py-5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between w-full px-[5%]">
        <Link href="/dashboard">
          <h1 className="text-[20px] font-bold hover:text-[#CCD4DE] transition-colors">
            MiniEdu
          </h1>
        </Link>
        <div>
          <ul className="flex gap-x-4">
            {menu.map((item, index) => {
              if (item.isAuth && !user?.data) return;

              if (item.link === "/register" && user?.data) {
                return (
                  <Link
                    key={index}
                    className="hover:text-[#CCD4DE] transition-colors cursor-pointer"
                    href="/account"
                  >
                    Cont personal
                  </Link>
                );
              }

              if (item.isAuth && user?.data) {
                return (
                  <li
                    key={index}
                    className="hover:text-[#CCD4DE] transition-colors"
                  >
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                );
              }

              return (
                <li
                  key={index}
                  className="hover:text-[#CCD4DE] transition-colors"
                >
                  <Link href={item.link}>{item.title}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
};
