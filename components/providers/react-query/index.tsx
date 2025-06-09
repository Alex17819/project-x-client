"use client";

import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ToastProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export const ReactQueryClientProvider = ({ children }: ToastProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
};
