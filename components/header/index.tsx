"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useRouter } from "next/navigation";
import { UserRoles } from "@/types/user";

const menu = [
  {
    title: "Dashboard",
    link: "/dashboard",
    isAuth: true,
    roles: UserRoles.TEACHER,
  },
  {
    title: "Register",
    link: "/register",
  },
];

export const Header = () => {
  const { data: user, refetch } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: false,
  });

  return (
    <header className="bg-[#3E53A0] text-white py-5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between w-full px-[5%]">
        <Link href="/blocks">
          <h1 className="text-[20px] font-bold hover:text-[#CCD4DE] transition-colors">
            Project-X
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
                    Account
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
