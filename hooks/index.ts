import { useEffect, useState } from "react";

export const useLockBodyScroll = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const main = document.querySelector("main") as HTMLElement;
    const header = document.querySelector("header") as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = main?.style.paddingRight ?? "";
    const originalHeaderPaddingRight = header?.style.paddingRight ?? "";

    main.style.overflow = "hidden";

    if (main) {
      main.style.paddingRight = `calc(5% + ${scrollBarWidth}px)`;
      header.style.paddingRight = `calc(5% + ${scrollBarWidth}px)`;
    }

    return () => {
      main.style.overflow = originalOverflow;
      if (main) {
        main.style.paddingRight = originalPaddingRight;
        header.style.paddingRight = originalHeaderPaddingRight;
      }
    };
  }, [enabled]);
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const hasAuthCookies =
        document.cookie.includes("accessToken") ||
        document.cookie.includes("refreshToken");
      setIsAuthenticated(hasAuthCookies);
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};
