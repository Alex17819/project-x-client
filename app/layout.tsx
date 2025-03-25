import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toastify";

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comicNeue.className}`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
