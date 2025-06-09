"use client";

import Link from "next/link";
import { api } from "@/api/axios";
import { UserRoles } from "@/types/user";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";

import { Comic_Neue, Ranchers } from "next/font/google";

const menu = [
  {
    title: "Proiecte",
    link: "/dashboard",
    isAuth: true,
    roles: UserRoles.TEACHER,
  },
  // {
  //   title: "Înregistrare",
  //   link: "/register",
  // },
];

const ranchers = Ranchers({
  variable: "--font-ranchers",
  subsets: ["latin"],
  weight: "400",
});

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
    <header className="header text-white py-15 relative">
      <img
        src="/assets/images/header-bg-4.jpg"
        alt="header bg"
        className="size-full absolute top-0 left-0 object-cover z-[-1]"
      />
      <div className="max-w-[1440px] mx-auto flex items-center justify-between w-full px-[5%]">
        <Link href="/dashboard">
          <h1
            className={`${ranchers.className} text-5xl text-sky-800 hover:underline transition-colors`}
          >
            MiniEdu
          </h1>
        </Link>
        <div>
          <ul className="flex gap-x-4">
            {menu.map((item, index) => {
              if (item.isAuth && !user?.data) return;

              if (item.isAuth && user?.data) {
                return (
                  <li
                    key={index}
                    className="text-2xl text-black hover:underline transition-colors"
                  >
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                );
              }

              return (
                <li
                  key={index}
                  className="text-2xl text-black hover:underline transition-colors"
                >
                  <Link href={item.link}>{item.title}</Link>
                </li>
              );
            })}
            {user?.data && (
              <Link
                className="text-2xl text-black hover:underline transition-colors cursor-pointer"
                href="/account"
              >
                Cont personal
              </Link>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};
