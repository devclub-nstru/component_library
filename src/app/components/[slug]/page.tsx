import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponentBySlug, getAllComponents } from "@/registry";
import { ComponentStudio } from "@/components/showcase/component-studio";
import { createPageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = getAllComponents();
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return {};
  }

  return createPageMetadata({
    title: component.name,
    description: component.description,
    path: `/components/${component.slug}`,
  });
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const allComponents = getAllComponents();

  return (
    <div className="h-dvh w-full bg-background text-foreground transition-colors duration-200 overflow-hidden">
      <ComponentStudio component={component} allComponents={allComponents} />
    </div>
  );
}
