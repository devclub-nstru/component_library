"use client";

import { useEffect, useState } from "react";

export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("theme-change", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("theme-change", update);
    };
  }, []);

  return isDark;
}
