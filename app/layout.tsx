import type { Metadata } from "next";
import { ReactNode } from "react";
import { Comic_Neue } from "next/font/google";

import { ToastProvider } from "@/components/providers/toastify";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/providers/react-query";
import { Header } from "@/components/header";

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Project-x",
};

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
        <ReactQueryClientProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 px-[5%] w-full max-w-[1440px] mx-auto">
              {children}
            </main>
          </ToastProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
