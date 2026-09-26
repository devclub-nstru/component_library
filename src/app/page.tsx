"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import HeroSection from "@/components/hero-section";

export default function Home() {
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#050505";
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  return (
    <div
      className="dark min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5]"
      style={{ colorScheme: "dark" }}
    >
      <Navbar showThemeToggle={false} />
      <main className="flex-1 flex flex-col">
        <HeroSection />
      </main>
    </div>
  );
}
