import { Navbar } from "@/components/layout/navbar";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5]">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />
      </main>
    </div>
  );
}
