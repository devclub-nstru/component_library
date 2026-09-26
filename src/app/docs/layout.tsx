import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { DocsPagination } from "@/components/layout/docs-pagination";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        <DocsSidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-10 lg:py-14">
          <div className="max-w-3xl">
            {children}
            <DocsPagination />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
