import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";
import { createPageMetadata } from "@/lib/metadata";
import { fetchComponentBySlug, getComponentCategories } from "@/lib/registry";

export const metadata = createPageMetadata({
  title: "Registry",
  description:
    "DevClub UI JSON registry schema, REST endpoints, and programmatic distribution.",
  path: "/docs/registry",
});

const SAMPLE_SLUG = "noise";
const SAMPLE_STRING_LENGTH = 96;
const SAMPLE_ARRAY_LENGTH = 2;

function shortenSample(value: unknown): unknown {
  if (typeof value === "string") {
    return value.length > SAMPLE_STRING_LENGTH
      ? `${value.slice(0, SAMPLE_STRING_LENGTH)}…`
      : value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, SAMPLE_ARRAY_LENGTH).map(shortenSample);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, shortenSample(entry)]),
    );
  }
  return value;
}

const REGISTRY_ITEM_INTERFACE = `export interface ComponentRegistryItem {
  slug: string;
  name: string;
  description: string;
  summary?: string;
  category: ComponentCategory;
  tags: string[];
  dependencies: string[];
  registryDependencies?: string[];
  version: string;
  createdDate: string;
  updatedDate: string;
  highlights?: string[];
  anatomy?: string[];
  physics?: ComponentPhysicsSpec;
  accessibility?: ComponentAccessibilitySpec;
  guidelines?: ComponentGuidelines;
  props?: ComponentProp[];
  files: {
    name: string;
    path: string;
    code: string;
  }[];
  interactive?: boolean;
  supportsColor?: boolean;
}`;

const LIST_RESPONSE_SHAPE = `{
  "success": true,
  "data": {
    "components": ComponentRegistryItem[],
    "total": number,
    "categories": ComponentCategory[]
  },
  "timestamp": string
}`;

export default function DocsRegistryPage() {
  const categories = getComponentCategories();
  const sampleComponent = fetchComponentBySlug(SAMPLE_SLUG);
  const samplePayload = JSON.stringify(
    {
      success: true,
      data: shortenSample(sampleComponent),
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  );

  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Registry Specification
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          DevClub UI distributes components via an open JSON registry specification that can be consumed by CLI tools, automated agents, or custom build pipelines.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          REST Endpoints
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          The registry exposes clean REST endpoints to search, filter, and fetch component source code programmatically:
        </p>
        <div className="space-y-3 font-sans">
          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /api/components
                </span>
              </div>
              <span className="text-xs text-muted-foreground">List Catalog</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Returns all browsable registry components with their full source, the total count, and the list of category ids. Supports query parameters <code className="text-foreground">?category=</code>, <code className="text-foreground">?q=</code>, and <code className="text-foreground">?tag=</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /api/components/[slug]
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Fetch Component Detail</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Returns a single component item, including its source files, dependencies, props, and accessibility metadata. Unknown slugs return a 404 with <code className="text-foreground">success: false</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /r/registry.json
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Shadcn Registry Index</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Open shadcn-compatible schema catalog. Individual components can be installed directly via <code className="text-foreground">npx shadcn@latest add https://ui.devclubxnst.online/r/[name].json</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /api/health
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Health & Diagnostics</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Status check returning <code className="text-foreground">status</code>, <code className="text-foreground">version</code>, <code className="text-foreground">uptime</code> (seconds since the serving instance started), <code className="text-foreground">timestamp</code>, and <code className="text-foreground">environment</code>. Use <code className="text-foreground">/api/components</code> for component counts.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Registry Item Schema
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Each component returned by the API has the following shape. Items also carry the shadcn registry fields <code className="text-foreground">$schema</code>, <code className="text-foreground">type</code> and <code className="text-foreground">title</code>, and each file includes <code className="text-foreground">content</code>, <code className="text-foreground">type</code> and <code className="text-foreground">target</code>.
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="src/types/component.ts"
            language="typescript"
            code={REGISTRY_ITEM_INTERFACE}
          />
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          <code className="text-foreground">GET /api/components</code> wraps the items in this envelope:
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="Response shape"
            language="typescript"
            code={LIST_RESPONSE_SHAPE}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Categories
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          <code className="text-foreground">ComponentCategory</code> is one of the {categories.length} ids below. Pass the id to <code className="text-foreground">?category=</code>.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {categories.map((category) => (
            <li
              key={category.value}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/40 px-3 py-2"
            >
              <code className="font-mono text-[11px] text-foreground">
                {category.value}
              </code>
              <span className="text-muted-foreground font-light">
                {category.label} ({category.items.length})
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Sample Response Payload
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Executing a GET request against <code className="text-foreground">/api/components/{SAMPLE_SLUG}</code> produces the following response. It is generated from the live registry data; long strings and arrays are shortened here.
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="Response (application/json)"
            language="json"
            code={samplePayload}
          />
        </div>
      </section>
    </article>
  );
}
