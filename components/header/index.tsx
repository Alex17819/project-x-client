"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useRouter } from "next/navigation";

const menu = [
  {
    title: "Blocks",
    link: "/blocks",
  },
  {
    title: "Register",
    link: "/register",
  },
];

export const Header = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: user, refetch } = useQuery({
    queryKey: ["USER_GET"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: false,
  });

  console.log("HEADER", user?.data);

  return (
    <header className="bg-[#3E53A0] px-[5%] text-white flex items-center justify-between py-5">
      <Link href="/blocks">
        <h1 className="text-[20px] font-bold hover:text-[#CCD4DE] transition-colors">
          Project-X
        </h1>
      </Link>
      <div>
        <ul className="flex gap-x-4">
          {menu.map((item, index) => {
            if (item.link === "/register" && user?.data) {
              return (
                <li
                  key={index}
                  className="hover:text-[#CCD4DE] transition-colors cursor-pointer"
                  onClick={async () => {
                    await api.post("/auth/logout");
                    queryClient.removeQueries({
                      queryKey: ["USER_GET"],
                    });
                    router.replace("/login");
                    await refetch();
                  }}
                >
                  Logout
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
    </header>
  );
};
