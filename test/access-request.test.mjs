import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, test } from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/registry/ui/access-request-state.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
});
const { accessRequestReducer: reduce, createAccessRequestState: create } =
  await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
const people = [
  { id: "a", name: "Alex" },
  { id: "b", name: "Blair" },
];
const apply = (state, ...events) => events.reduce(reduce, state);
const begin = (id, decision = "approved") => ({ type: "begin", id, decision });
const resolve = (id, decision = "approved") => ({
  type: "resolve",
  id,
  decision,
});
const remove = (id) => ({ type: "remove", id });
const sync = (requests) => ({ type: "sync", requests });

describe("access request lifecycle", () => {
  test("deduplicates requests safely while preserving first-seen order", () => {
    const state = create([
      ...people,
      { id: "a", name: "Updated" },
      { id: "__proto__", name: "Pat" },
    ]);
    assert.deepEqual(
      state.entries.map(({ person }) => person.name),
      ["Updated", "Blair", "Pat"],
    );
  });

  test("allows concurrent decisions and counts each completed exit once", () => {
    const initial = create(people);
    const pending = apply(initial, begin("a"), begin("b", "declined"));
    assert.deepEqual(
      pending.entries.map(({ phase }) => phase),
      ["pending", "pending"],
    );
    assert.equal(reduce(pending, begin("a", "declined")), pending);
    const decided = apply(pending, resolve("b", "declined"), resolve("a"));
    assert.equal(decided.approved, 0);
    const finished = apply(decided, remove("b"), remove("a"), remove("a"));
    assert.deepEqual(finished.entries, []);
    assert.equal(finished.approved, 1);
    assert.equal(finished.declined, 1);
    assert.deepEqual(
      initial.entries.map(({ phase }) => phase),
      ["idle", "idle"],
    );
  });

  test("ignores premature removals and mismatched or late completions", () => {
    const initial = create(people);
    assert.equal(reduce(initial, remove("a")), initial);
    assert.equal(reduce(initial, resolve("a")), initial);
    const pending = reduce(initial, begin("a"));
    assert.equal(reduce(pending, remove("a")), pending);
    assert.equal(reduce(pending, resolve("a", "declined")), pending);
    const decided = reduce(pending, resolve("a"));
    assert.equal(
      reduce(decided, { type: "reject", id: "a", message: "Late error" }),
      decided,
    );
    assert.equal(reduce(decided, resolve("a")), decided);
  });

  test("retains failed requests and clears the error on retry", () => {
    const failed = apply(create(people), begin("a"), {
      type: "reject",
      id: "a",
      message: "Please retry",
    });
    assert.equal(failed.entries[0].phase, "idle");
    assert.equal(failed.entries[0].error, "Please retry");
    assert.equal(failed.entries[0].decision, undefined);
    const retried = reduce(failed, begin("a", "declined"));
    assert.equal(retried.entries[0].error, undefined);
    const finished = apply(retried, resolve("a", "declined"), remove("a"));
    assert.equal(finished.declined, 1);
    assert.equal(finished.approved, 0);
  });

  test("external removal cancels pending state without counting a decision", () => {
    const cancelled = apply(create(people), begin("a"), sync([people[1]]));
    assert.equal(cancelled.entries[0].phase, "removing");
    assert.equal(reduce(cancelled, resolve("a")), cancelled);
    const finished = reduce(cancelled, remove("a"));
    assert.equal(finished.approved, 0);
    assert.deepEqual(finished.settledIds, []);
  });

  test("revives a reintroduced request without stale pending or error state", () => {
    const revived = apply(create(people), begin("a"), sync([]), sync(people));
    assert.deepEqual(revived.entries[0], { person: people[0], phase: "idle" });
  });

  test("does not resurrect settled rows from a stale parent list", () => {
    const finished = apply(
      create(people),
      begin("a"),
      resolve("a"),
      remove("a"),
    );
    const stale = reduce(
      finished,
      sync([...people, { id: "c", name: "Casey" }]),
    );
    assert.deepEqual(
      stale.entries.map(({ person }) => person.id),
      ["b", "c"],
    );
    const acknowledged = reduce(stale, sync([people[1]]));
    assert.deepEqual(acknowledged.settledIds, []);
    const newRequest = reduce(acknowledged, sync(people));
    assert.equal(
      newRequest.entries.find(({ person }) => person.id === "a").phase,
      "idle",
    );
  });

  test("preserves an acknowledged decision until its visual exit completes", () => {
    const acknowledged = apply(
      create(people),
      begin("a"),
      resolve("a"),
      sync([people[1]]),
    );
    assert.equal(acknowledged.entries[0].phase, "decided");
    const finished = reduce(acknowledged, remove("a"));
    assert.equal(finished.approved, 1);
  });

  test("updates live person data without reordering active rows", () => {
    const updated = reduce(
      create(people),
      sync([{ ...people[1], name: "Blair Updated" }, people[0]]),
    );
    assert.deepEqual(
      updated.entries.map(({ person }) => person.name),
      ["Alex", "Blair Updated"],
    );
  });
});
