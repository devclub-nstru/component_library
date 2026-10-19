export type AccessDecision = "approved" | "declined";

export interface AccessRequester {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  emoji?: string;
  color?: string;
  description?: string;
}

export interface AccessRequestEntry {
  person: AccessRequester;
  phase: "idle" | "pending" | "decided" | "removing";
  decision?: AccessDecision;
  error?: string;
}

export interface AccessRequestState {
  entries: AccessRequestEntry[];
  settledIds: string[];
  approved: number;
  declined: number;
}

export type AccessRequestEvent =
  | { type: "sync"; requests: readonly AccessRequester[] }
  | { type: "begin" | "resolve"; id: string; decision: AccessDecision }
  | { type: "reject"; id: string; message: string }
  | { type: "remove"; id: string };

export function createAccessRequestState(
  requests: readonly AccessRequester[],
): AccessRequestState {
  return {
    entries: Array.from(
      new Map(requests.map((person) => [person.id, person])).values(),
    ).map((person) => ({ person, phase: "idle" })),
    settledIds: [],
    approved: 0,
    declined: 0,
  };
}

export function accessRequestReducer(
  state: AccessRequestState,
  event: AccessRequestEvent,
): AccessRequestState {
  if (event.type === "sync") {
    const incoming = new Map(
      event.requests.map((person) => [person.id, person]),
    );
    const present = new Set(state.entries.map((entry) => entry.person.id));
    const entries = state.entries.map((entry): AccessRequestEntry => {
      const person = incoming.get(entry.person.id);
      if (person)
        return entry.phase === "removing"
          ? { person, phase: "idle" }
          : { ...entry, person };
      return entry.phase === "decided"
        ? entry
        : { ...entry, phase: "removing", error: undefined };
    });
    for (const person of incoming.values()) {
      if (!present.has(person.id) && !state.settledIds.includes(person.id))
        entries.push({ person, phase: "idle" });
    }
    return {
      ...state,
      entries,
      settledIds: state.settledIds.filter((id) => incoming.has(id)),
    };
  }

  const entry = state.entries.find((item) => item.person.id === event.id);
  if (!entry) return state;
  let next: AccessRequestEntry;

  switch (event.type) {
    case "begin":
      if (entry.phase !== "idle") return state;
      next = {
        ...entry,
        phase: "pending",
        decision: event.decision,
        error: undefined,
      };
      break;
    case "resolve":
      if (entry.phase !== "pending" || entry.decision !== event.decision)
        return state;
      next = { ...entry, phase: "decided", error: undefined };
      break;
    case "reject":
      if (entry.phase !== "pending") return state;
      next = {
        ...entry,
        phase: "idle",
        decision: undefined,
        error: event.message,
      };
      break;
    case "remove":
      if (entry.phase !== "decided" && entry.phase !== "removing") return state;
      return {
        ...state,
        entries: state.entries.filter((item) => item.person.id !== event.id),
        settledIds:
          entry.phase === "decided"
            ? [...state.settledIds, event.id]
            : state.settledIds,
        approved:
          state.approved +
          Number(entry.phase === "decided" && entry.decision === "approved"),
        declined:
          state.declined +
          Number(entry.phase === "decided" && entry.decision === "declined"),
      };
  }

  return {
    ...state,
    entries: state.entries.map((item) =>
      item.person.id === event.id ? next : item,
    ),
  };
}
