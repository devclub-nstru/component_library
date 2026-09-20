import React from "react";
import { notFound } from "next/navigation";
import { getComponentBySlug, getAllComponents } from "@/registry";
import { ComponentStudio } from "@/components/showcase/component-studio";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = getAllComponents();
  return components.map((c) => ({ slug: c.slug }));
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const allComponents = getAllComponents();

  return (
    <div className="h-screen w-screen bg-black text-[#f4f4f5] overflow-hidden">
      <ComponentStudio component={component} allComponents={allComponents} />
    </div>
  );
}
