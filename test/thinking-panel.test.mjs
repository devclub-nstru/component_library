import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/registry/ui/thinking-panel-types.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { thinkingSourceUrl } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("source links preserve valid HTTP and HTTPS destinations", () => {
  assert.equal(
    thinkingSourceUrl("https://en.wikipedia.org/wiki/Lisbon"),
    "https://en.wikipedia.org/wiki/Lisbon",
  );
  assert.equal(
    thinkingSourceUrl("http://localhost:3000/search?q=Lisbon"),
    "http://localhost:3000/search?q=Lisbon",
  );
});

test("source links reject executable, malformed and unsupported URLs", () => {
  for (const href of [
    undefined,
    "",
    "not a url",
    "/relative",
    "//example.com",
    "javascript:alert(1)",
    "data:text/html,test",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "mailto:team@example.com",
  ])
    assert.equal(thinkingSourceUrl(href), undefined, href);
});
