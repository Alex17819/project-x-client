import type { Metadata } from "next";
import { ReactNode } from "react";
import { Comic_Neue } from "next/font/google";

import Link from "next/link";

import { ToastProvider } from "@/components/providers/toastify";
import "./globals.css";

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Project-x",
};

const menu = [
  {
    title: "Blocks",
    link: "/blocks",
  },
  {
    title: "AI Image Generation",
    link: "/ai-image-generation",
  },
  {
    title: "Register",
    link: "/register",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicNeue.className} bg-[#ECEEF0] h-screen flex flex-col`}
      >
        <header className="bg-[#3E53A0] px-[5%] text-white flex items-center justify-between py-5">
          <Link href="/blocks">
            <h1 className="text-[20px] font-bold hover:text-[#CCD4DE] transition-colors">
              Project-X
            </h1>
          </Link>
          <div>
            <ul className="flex gap-x-4">
              {menu.map((item, index) => (
                <li
                  key={index}
                  className="hover:text-[#CCD4DE] transition-colors"
                >
                  <Link href={item.link}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </header>
        <ToastProvider>
          <main className="flex-1">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
