"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowUp,
  CircleAlert,
  File as FileIcon,
  FileArchive,
  FileImage,
  FilePlay,
  FileText,
  RotateCw,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

export type FileDropzoneStatus = "uploading" | "uploaded" | "failed";

export type FileDropzoneItem = {
  id: string;
  name: string;
  size: number;
  status?: FileDropzoneStatus;
  progress?: number;
  error?: string;
  retryable?: boolean;
  file?: File;
  preview?: string;
};

export type FileDropzoneUpload = (
  item: FileDropzoneItem,
  options: { onProgress: (percent: number) => void; signal: AbortSignal },
) => Promise<void>;

export type FileDropzoneProps = {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  label?: string;
  description?: string;
  defaultItems?: FileDropzoneItem[];
  onUpload?: FileDropzoneUpload;
  maxSize?: number;
  listPlacement?: "below" | "inside";
  note?: string;
  dropLabel?: string;
  compactAt?: number;
  className?: string;
};

const MB = 1024 * 1024;
const enter: Transition = {
  duration: motionTokens.duration.standard,
  ease: [...motionTokens.ease.enter],
};
const exitFast: Transition = {
  duration: motionTokens.duration.fast,
  ease: [...motionTokens.ease.standard],
};
const instant: Transition = { duration: 0 };
const fade: Transition = { duration: motionTokens.duration.instant };
const collapse: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};
const textIn: TargetAndTransition = {
  opacity: 0,
  y: "0.3em",
  filter: `blur(${motionTokens.blur.soft}px)`,
};
const textOut: TargetAndTransition = {
  opacity: 0,
  y: "-0.3em",
  filter: `blur(${motionTokens.blur.subtle}px)`,
  transition: exitFast,
};
const shown: TargetAndTransition = {
  opacity: 1,
  y: "0em",
  filter: "blur(0px)",
};
const clamp = (value: number) => Math.min(Math.max(value, 0), 100);
const SHAKE = { x: [0, -7, 6, -4, 3, -1.5, 0] };
const shakeTransition: Transition = { duration: 0.42, ease: "easeOut" };
const land: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 22,
  mass: 0.8,
};

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  const mb = bytes / MB;
  return `${mb >= 10 ? Math.round(mb) : Number(mb.toFixed(1))} MB`;
}

function TypeIcon({ name }: { name: string }) {
  const props = { size: 20, strokeWidth: 1.75, "aria-hidden": true } as const;
  const extension = name.toLowerCase().split(".").pop() ?? "";
  if (
    ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "heic"].includes(
      extension,
    )
  ) {
    return <FileImage {...props} />;
  }
  if (["mov", "mp4", "webm", "m4v", "avi"].includes(extension)) {
    return <FilePlay {...props} />;
  }
  if (["zip", "gz", "tar", "rar", "7z"].includes(extension)) {
    return <FileArchive {...props} />;
  }
  if (["pdf", "md", "txt", "doc", "docx", "rtf"].includes(extension)) {
    return <FileText {...props} />;
  }
  return <FileIcon {...props} />;
}

function Swap(props: HTMLMotionProps<"span">) {
  const present = useIsPresent();
  return (
    <motion.span
      {...props}
      aria-hidden={present ? props["aria-hidden"] : true}
    />
  );
}

function TextSwap({
  text,
  className,
  reduce,
}: {
  text: string;
  className?: string;
  reduce: boolean;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Swap
        key={text}
        className={className}
        initial={reduce ? { opacity: 0 } : textIn}
        animate={shown}
        exit={reduce ? { opacity: 0, transition: fade } : textOut}
        transition={reduce ? fade : enter}
      >
        {text}
      </Swap>
    </AnimatePresence>
  );
}

function MotionText({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="inline-flex flex-wrap gap-x-1" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          {words.map((word, index) => (
            <motion.span
              key={`${index}:${word}`}
              className="inline-block"
              initial={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: "0.35em",
                      filter: `blur(${motionTokens.blur.soft}px)`,
                    }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduced
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      y: "-0.35em",
                      filter: `blur(${motionTokens.blur.subtle}px)`,
                      transition: {
                        duration: 0.14,
                        ease: [...motionTokens.ease.standard],
                      },
                    }
              }
              transition={
                reduced
                  ? { duration: motionTokens.duration.instant }
                  : {
                      duration: motionTokens.duration.standard,
                      ease: [...motionTokens.ease.enter],
                    }
              }
            >
              {index < words.length - 1 ? `${word} ` : word}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </>
  );
}

function ErrorRow({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const copyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const node = copyRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? node.offsetHeight),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="overflow-hidden mt-2"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height, opacity: 1 }}
      exit={{
        height: 0,
        opacity: 0,
        transition: reduced
          ? { duration: 0 }
          : {
              height: collapse,
              opacity: { duration: motionTokens.duration.instant },
            },
      }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              height: {
                type: "spring",
                stiffness: 340,
                damping: 28,
                mass: 0.8,
              },
              opacity: { duration: motionTokens.duration.fast },
            }
      }
    >
      <motion.div
        ref={copyRef}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-500 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20"
        role="alert"
        initial={
          reduced
            ? false
            : { y: "0.35em", filter: `blur(${motionTokens.blur.soft}px)` }
        }
        animate={{ y: 0, filter: "blur(0px)" }}
        transition={{
          duration: reduced ? 0 : motionTokens.duration.standard,
          ease: [...motionTokens.ease.enter],
        }}
      >
        <CircleAlert
          className="size-4 shrink-0"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <span className="flex-1 min-w-0">
          <MotionText text={text} />
        </span>
      </motion.div>
    </motion.div>
  );
}

function DrawnCheck({ reduce }: { reduce: boolean }) {
  return (
    <svg
      className="size-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.path
        d="M12 2.5a9.5 9.5 0 1 1 0 19a9.5 9.5 0 1 1 0-19"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: motionTokens.duration.considered * 0.7,
          ease: [...motionTokens.ease.enter],
        }}
      />
      <motion.path
        d="m8.2 12.4 2.6 2.6 5-5.2"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ ...enter, delay: 0.16 }}
      />
    </svg>
  );
}

type RowProps = {
  item: FileDropzoneItem;
  reduce: boolean;
  delay: number;
  fresh: boolean;
  canRetry: boolean;
  onRemove: () => void;
  onRetry: () => void;
  removeRef: (node: HTMLButtonElement | null) => void;
};

function Thumb({ item }: { item: FileDropzoneItem }) {
  const [broken, setBroken] = useState(false);
  if (!item.preview || broken) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-200/60 dark:bg-[#202023] text-neutral-600 dark:text-neutral-400 border border-neutral-300/40 dark:border-white/8">
        <TypeIcon name={item.name} />
      </span>
    );
  }
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-200/60 dark:bg-[#202023] border border-neutral-300/40 dark:border-white/8">
      <img
        src={item.preview}
        alt=""
        width={40}
        height={40}
        decoding="async"
        className="h-full w-full object-cover"
        onError={() => setBroken(true)}
      />
    </span>
  );
}

function FileRow({
  item,
  reduce,
  delay,
  fresh,
  canRetry,
  onRemove,
  onRetry,
  removeRef,
}: RowProps) {
  const { status } = item;
  const rowRef = useRef<HTMLDivElement>(null);
  const shakenFor = useRef<FileDropzoneStatus | "new" | undefined>(
    fresh ? "new" : status,
  );

  useEffect(() => {
    const previous = shakenFor.current;
    if (status === previous) return;
    shakenFor.current = status;
    const node = rowRef.current;
    if (status !== "failed" || reduce || !node) return;
    animate(node, SHAKE, {
      ...shakeTransition,
      delay: previous === "new" ? delay + 0.3 : 0,
    });
  }, [status, reduce, delay]);

  const progress = useMotionValue(
    status === "uploaded" ? 100 : (item.progress ?? 0),
  );
  const x = useTransform(progress, (value) => `${clamp(value) - 100}%`);
  const percent = useTransform(
    progress,
    (value) => `${Math.round(clamp(value))}%`,
  );

  const [filled, setFilled] = useState(status !== "uploading");
  const [seen, setSeen] = useState(status);
  if (seen !== status) {
    setSeen(status);
    if (status === "uploading") setFilled(false);
  }

  const phase =
    status === "uploaded" && !filled && !reduce ? "uploading" : status;
  const target = status === "uploaded" ? 100 : (item.progress ?? 0);

  useEffect(() => {
    if (status !== "uploading" && status !== "uploaded") return;
    if (reduce || (status === "uploading" && target === 0)) {
      progress.jump(target);
      return;
    }
    const controls = animate(progress, target, {
      type: "spring",
      stiffness: 280,
      damping: 28,
      onComplete: status === "uploaded" ? () => setFilled(true) : undefined,
    });
    return () => controls.stop();
  }, [status, target, progress, reduce]);

  useMotionValueEvent(progress, "change", (value) => {
    if (status === "uploaded" && value >= 99.5) setFilled(true);
  });

  const failed = status === "failed";
  const retry = failed && canRetry && item.retryable !== false;

  return (
    <motion.li
      className="overflow-hidden list-none"
      initial={reduce ? { opacity: 0 } : { height: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={
        reduce
          ? { opacity: 0, transition: fade }
          : {
              height: 0,
              opacity: 0,
              transition: {
                height: collapse,
                opacity: { ...exitFast, delay: 0.04 },
              },
            }
      }
      transition={
        reduce
          ? fade
          : {
              height: {
                type: "spring",
                stiffness: 320,
                damping: 28,
                mass: 0.8,
                delay,
              },
              opacity: fade,
            }
      }
    >
      <motion.div
        ref={rowRef}
        className={cn(
          "group relative flex items-center gap-3.5 p-2.5 pl-3 pr-3.5 rounded-2xl border transition-colors select-none",
          failed
            ? "bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 dark:border-rose-500/30 text-rose-500 dark:text-rose-300"
            : "bg-neutral-100/80 dark:bg-[#1a1a1c] border-neutral-200/80 dark:border-white/8 hover:border-neutral-300 dark:hover:border-white/[0.14]",
        )}
        initial={
          reduce
            ? false
            : {
                opacity: 0,
                y: -22,
                scale: 0.94,
                filter: `blur(${motionTokens.blur.soft}px)`,
              }
        }
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={
          reduce
            ? undefined
            : {
                scale: 0.97,
                filter: `blur(${motionTokens.blur.subtle}px)`,
                transition: exitFast,
              }
        }
        transition={
          reduce
            ? instant
            : {
                y: { ...land, delay },
                scale: { ...land, delay },
                opacity: { ...enter, delay },
                filter: { ...enter, delay },
              }
        }
      >
        <Thumb item={item} />
        <span className="flex flex-col min-w-0 flex-1 justify-center">
          <span
            className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100 tracking-tight"
            title={item.name}
          >
            {item.name}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            <span className="shrink-0 whitespace-nowrap">{formatFileSize(item.size)}</span>
            {phase && (
              <>
                <span
                  className="text-neutral-400 dark:text-neutral-600"
                  aria-hidden="true"
                >
                  ·
                </span>
                <span className="inline-flex min-w-0 items-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <Swap
                      key={phase}
                      className={cn(
                        "inline-flex min-w-0 items-center gap-1.5 font-medium",
                        phase === "uploaded" &&
                          "text-emerald-600 dark:text-emerald-400",
                        phase === "failed" &&
                          "text-rose-500 dark:text-rose-400",
                      )}
                      initial={reduce ? { opacity: 0 } : textIn}
                      animate={shown}
                      exit={reduce ? { opacity: 0, transition: fade } : textOut}
                      transition={reduce ? fade : enter}
                    >
                      {phase === "uploading" ? (
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Uploading{" "}
                          <motion.span className="tabular-nums font-mono">
                            {percent}
                          </motion.span>
                        </span>
                      ) : phase === "uploaded" ? (
                        <>
                          <DrawnCheck reduce={reduce} />
                          <span>Uploaded</span>
                        </>
                      ) : (
                        <>
                          <CircleAlert
                            className="size-3.5 shrink-0"
                            strokeWidth={2.25}
                            aria-hidden="true"
                          />
                          <span className="truncate" title={item.error}>
                            <span className="sr-only">Failed: </span>
                            {item.error || "Upload failed"}
                          </span>
                        </>
                      )}
                    </Swap>
                  </AnimatePresence>
                </span>
              </>
            )}
          </span>
          <AnimatePresence initial={false}>
            {phase === "uploading" && (
              <motion.span
                key="bar"
                className="overflow-hidden block"
                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={
                  reduce
                    ? { opacity: 0, transition: fade }
                    : {
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { ...collapse, delay: 0.22 },
                          opacity: { ...exitFast, delay: 0.16 },
                        },
                      }
                }
                transition={
                  reduce
                    ? fade
                    : {
                        height: {
                          type: "spring",
                          stiffness: 340,
                          damping: 28,
                          mass: 0.8,
                        },
                        opacity: enter,
                      }
                }
              >
                <span
                  className="relative mt-2 block h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
                  role="progressbar"
                  aria-label={`Uploading ${item.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(clamp(target))}
                >
                  <motion.span
                    className="block h-full w-full rounded-full bg-neutral-900 dark:bg-white"
                    style={{ x }}
                  />
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="flex items-center gap-1.5 shrink-0 ml-2">
          <AnimatePresence initial={false}>
            {retry && (
              <motion.span
                key="retry"
                className="overflow-hidden inline-flex"
                initial={reduce ? { opacity: 0 } : { width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={
                  reduce
                    ? { opacity: 0, transition: fade }
                    : {
                        width: 0,
                        opacity: 0,
                        transition: {
                          width: collapse,
                          opacity: { duration: motionTokens.duration.instant },
                        },
                      }
                }
                transition={
                  reduce
                    ? fade
                    : {
                        width: {
                          type: "spring",
                          stiffness: 340,
                          damping: 28,
                          mass: 0.8,
                        },
                        opacity: enter,
                      }
                }
              >
                <motion.span
                  className="inline-flex"
                  initial={
                    reduce
                      ? false
                      : {
                          scale: 0.8,
                          filter: `blur(${motionTokens.blur.subtle}px)`,
                        }
                  }
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={
                    reduce
                      ? instant
                      : {
                          type: "spring",
                          stiffness: 360,
                          damping: 24,
                          mass: 0.8,
                        }
                  }
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1 max-sm:px-2 text-xs font-medium rounded-full bg-neutral-200/80 hover:bg-neutral-200 dark:bg-neutral-800/90 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-white/10 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    onClick={onRetry}
                    aria-label={`Retry ${item.name}`}
                    title="Retry"
                  >
                    <RotateCw size={12} strokeWidth={2.25} aria-hidden="true" />
                    <span className="max-sm:sr-only">Retry</span>
                  </button>
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
          <button
            ref={removeRef}
            type="button"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            title="Remove"
          >
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </span>
      </motion.div>
    </motion.li>
  );
}

export function FileDropzone({
  accept,
  multiple = true,
  maxFiles = 5,
  onFilesChange,
  label = "Add files",
  description = "Drop files here or choose from your device",
  defaultItems,
  onUpload,
  maxSize,
  listPlacement = "below",
  note,
  dropLabel,
  compactAt,
  className,
}: FileDropzoneProps) {
  const [items, setItems] = useState<FileDropzoneItem[]>(
    () => defaultItems ?? [],
  );
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [batchStart, setBatchStart] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLButtonElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const controllers = useRef(new Map<string, AbortController>());
  const removeRefs = useRef(new Map<string, HTMLButtonElement>());
  const descriptionId = useId();
  const noteId = useId();
  const reduce = !!useReducedMotion();
  const inside = listPlacement === "inside";
  const compact = compactAt !== undefined && items.length >= compactAt;
  const [freshIds, setFreshIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const ownedPreviews = useRef(new Map<string, string>());
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  useEffect(() => {
    const active = controllers.current;
    const previews = ownedPreviews.current;
    return () => {
      active.forEach((controller) => controller.abort());
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const shakeZone = () => {
    if (!reduce && zoneRef.current)
      animate(zoneRef.current, SHAKE, shakeTransition);
  };

  const filesOf = (list: FileDropzoneItem[]) =>
    list.flatMap((item) => (item.file ? [item.file] : []));
  const patch = (
    id: string,
    next: (item: FileDropzoneItem) => FileDropzoneItem,
  ) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? next(item) : item)),
    );

  function startUpload(item: FileDropzoneItem) {
    if (!onUpload) return;
    controllers.current.get(item.id)?.abort();
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    patch(item.id, (current) => ({
      ...current,
      status: "uploading",
      progress: 0,
      error: undefined,
    }));
    onUpload(
      { ...item, status: "uploading", progress: 0, error: undefined },
      {
        signal: controller.signal,
        onProgress: (percent) => {
          if (!controller.signal.aborted) {
            patch(item.id, (current) =>
              current.status === "uploading"
                ? {
                    ...current,
                    progress: Math.max(current.progress ?? 0, clamp(percent)),
                  }
                : current,
            );
          }
        },
      },
    )
      .then(
        () => {
          if (controller.signal.aborted) return;
          patch(item.id, (current) => ({
            ...current,
            status: "uploaded",
            progress: 100,
          }));
          setAnnouncement(`${item.name} uploaded`);
        },
        (reason: unknown) => {
          if (controller.signal.aborted) return;
          const message =
            reason instanceof Error && reason.message
              ? reason.message
              : "Upload failed";
          patch(item.id, (current) => ({
            ...current,
            status: "failed",
            error: message,
            retryable: true,
          }));
          setAnnouncement(`${item.name} failed. ${message}`);
        },
      )
      .finally(() => {
        if (controllers.current.get(item.id) === controller) {
          controllers.current.delete(item.id);
        }
      });
  }

  function addFiles(incoming: FileList | File[]) {
    const list = Array.from(incoming);
    const accepted =
      accept
        ?.split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean) ?? [];
    const matching = list.filter(
      (file) =>
        accepted.length === 0 ||
        accepted.some((type) =>
          type.startsWith(".")
            ? file.name.toLowerCase().endsWith(type)
            : type.endsWith("/*")
              ? file.type.startsWith(type.slice(0, -1))
              : file.type === type,
        ),
    );
    const kept = multiple ? items : [];
    const same = (a: File, b: File) =>
      a.name === b.name &&
      a.size === b.size &&
      a.lastModified === b.lastModified;
    const fresh = matching.filter(
      (file, index) =>
        matching.findIndex((other) => same(other, file)) === index &&
        !kept.some((item) => item.file && same(item.file, file)),
    );
    const room = multiple ? Math.max(0, maxFiles - kept.length) : 1;
    const added = fresh.slice(0, room).map((file): FileDropzoneItem => {
      const tooLarge = maxSize !== undefined && file.size > maxSize;
      const id = `${file.name}-${file.size}-${file.lastModified}-${nextId.current++}`;
      const preview =
        file.type.startsWith("image/") &&
        typeof URL.createObjectURL === "function"
          ? URL.createObjectURL(file)
          : undefined;
      if (preview) ownedPreviews.current.set(id, preview);
      return {
        id,
        name: file.name,
        size: file.size,
        file,
        preview,
        status: tooLarge ? "failed" : onUpload ? "uploading" : undefined,
        progress: 0,
        error: tooLarge
          ? `File is larger than ${formatFileSize(maxSize)}`
          : undefined,
        retryable: !tooLarge,
      };
    });
    const rejected = matching.length !== list.length;
    const overflow = fresh.length > added.length;
    setError(
      rejected
        ? list.length - matching.length === 1 && list.length === 1
          ? `${list[0].name} is not an accepted file type.`
          : "Some files were not added because their type is not accepted."
        : overflow
          ? `You can add up to ${maxFiles} ${maxFiles === 1 ? "file" : "files"}.`
          : "",
    );
    if (rejected || overflow) shakeZone();
    if (!added.length) return;
    if (!multiple) {
      controllers.current.forEach((controller) => controller.abort());
      controllers.current.clear();
    }
    const next = [...kept, ...added];
    setFreshIds(
      (current) => new Set([...current, ...added.map((item) => item.id)]),
    );
    setBatchStart(kept.length);
    setItems((current) => (multiple ? [...current, ...added] : added));
    onFilesChange?.(filesOf(next));
    const failed = added.filter((item) => item.status === "failed");
    setAnnouncement(
      `${added.length} ${added.length === 1 ? "file" : "files"} added.${
        failed.length
          ? ` ${failed.map((item) => `${item.name}: ${item.error}`).join(". ")}.`
          : ""
      }`,
    );
    added.filter((item) => item.status === "uploading").forEach(startUpload);
  }

  function removeItem(target: FileDropzoneItem) {
    controllers.current.get(target.id)?.abort();
    controllers.current.delete(target.id);
    const index = items.findIndex((item) => item.id === target.id);
    const neighbor = items[index + 1] ?? items[index - 1];
    const next = items.filter((item) => item.id !== target.id);
    const preview = ownedPreviews.current.get(target.id);
    if (preview) {
      ownedPreviews.current.delete(target.id);
      window.setTimeout(() => URL.revokeObjectURL(preview), 600);
    }
    setItems((current) => current.filter((item) => item.id !== target.id));
    setError("");
    setAnnouncement(`${target.name} removed`);
    if (target.file) onFilesChange?.(filesOf(next));
    requestAnimationFrame(() =>
      (neighbor
        ? removeRefs.current.get(neighbor.id)
        : dropRef.current
      )?.focus(),
    );
  }

  function retryItem(item: FileDropzoneItem) {
    setAnnouncement(`Retrying ${item.name}`);
    startUpload(item);
    requestAnimationFrame(() => removeRefs.current.get(item.id)?.focus());
  }

  function moveFocus(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "Delete" || event.key === "Backspace") {
      const row = (event.target as HTMLElement).closest<HTMLElement>(`li`);
      const remove = row?.querySelector<HTMLButtonElement>(
        `button[title="Remove"]`,
      );
      if (remove) {
        event.preventDefault();
        remove.click();
      }
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const button = (event.target as HTMLElement).closest("button");
    const rows = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(`li`),
    );
    const row = button?.closest<HTMLElement>(`li`);
    if (!button || !row) return;
    const nextRow =
      rows[rows.indexOf(row) + (event.key === "ArrowDown" ? 1 : -1)];
    if (!nextRow) return;
    event.preventDefault();
    (
      nextRow.querySelector<HTMLButtonElement>(`button[title="Retry"]`) ??
      nextRow.querySelector<HTMLButtonElement>(`button[title="Remove"]`)
    )?.focus();
  }

  const pasteArmed = hovered || focusWithin;
  const addRef = useRef(addFiles);
  useLayoutEffect(() => {
    addRef.current = addFiles;
  });

  useEffect(() => {
    if (!pasteArmed) return;
    const onPaste = (event: ClipboardEvent) => {
      const files = event.clipboardData?.files;
      if (!files?.length) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input:not([type=file]), textarea, [contenteditable='true']",
        )
      )
        return;
      event.preventDefault();
      addRef.current(files);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [pasteArmed]);

  const carriesFiles = (event: DragEvent) =>
    Array.from(event.dataTransfer?.types ?? []).includes("Files");
  const dropCopy =
    dropLabel ??
    (onUpload
      ? "Drop to upload"
      : multiple
        ? "Drop to add files"
        : "Drop to add the file");
  const noteCopy =
    note ??
    (accept
      ? `Accepted: ${accept}`
      : `Up to ${maxFiles} ${maxFiles === 1 ? "file" : "files"}`);

  const slot = {
    initial: reduce ? { opacity: 0 } : { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: reduce
      ? { opacity: 0, transition: fade }
      : {
          height: 0,
          opacity: 0,
          transition: { height: collapse, opacity: exitFast },
        },
    transition: reduce
      ? fade
      : {
          height: {
            type: "spring" as const,
            stiffness: 340,
            damping: 28,
            mass: 0.8,
          },
          opacity: enter,
        },
  };

  const rowsInside = inside && items.length > 0;

  const list = (
    <motion.ul
      className={cn("flex flex-col gap-2.5 w-full", inside && "px-3 pb-3")}
      aria-label="Files"
      aria-hidden={items.length ? undefined : true}
      onKeyDown={moveFocus}
      initial={false}
      animate={{
        paddingTop: items.length && !inside ? 4 : 0,
      }}
      transition={
        reduce
          ? instant
          : { type: "spring", stiffness: 340, damping: 28, mass: 0.8 }
      }
    >
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <FileRow
            key={item.id}
            item={item}
            reduce={reduce}
            delay={
              reduce
                ? 0
                : Math.min(Math.max(0, index - batchStart), 7) *
                  motionTokens.stagger.item *
                  1.6
            }
            fresh={freshIds.has(item.id)}
            canRetry={!!onUpload}
            onRemove={() => removeItem(item)}
            onRetry={() => retryItem(item)}
            removeRef={(node) => {
              if (node) removeRefs.current.set(item.id, node);
              else removeRefs.current.delete(item.id);
            }}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );

  return (
    <div
      className={cn("w-full flex flex-col gap-3 font-sans", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
    >
      <div
        ref={zoneRef}
        className={cn(
          "relative w-full rounded-[28px] overflow-hidden select-none transition-colors duration-200 border border-neutral-200 dark:border-white/8 bg-neutral-100/50 dark:bg-[#161618]/60 backdrop-blur-xs",
          dragging &&
            "border-neutral-400 dark:border-white/25 bg-neutral-200/50 dark:bg-neutral-800/40",
        )}
        onDragEnter={(event) => {
          if (!carriesFiles(event)) return;
          event.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          if (!carriesFiles(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(event) => {
          if (!carriesFiles(event)) return;
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (!dragDepth.current) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          if (event.dataTransfer.files.length)
            addFiles(event.dataTransfer.files);
        }}
      >
        <motion.button
          ref={dropRef}
          type="button"
          className="relative z-10 w-full flex flex-col items-center justify-center text-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 rounded-[inherit] px-6"
          onClick={() => inputRef.current?.click()}
          aria-describedby={
            compact ? descriptionId : `${descriptionId} ${noteId}`
          }
          initial={false}
          animate={{
            paddingTop: compact ? 16 : 30,
            paddingBottom: compact
              ? rowsInside
                ? 8
                : 16
              : rowsInside
                ? 16
                : 30,
          }}
          transition={
            reduce
              ? instant
              : { type: "spring", stiffness: 340, damping: 28, mass: 0.8 }
          }
        >
          <AnimatePresence initial={false}>
            {(!compact || dragging) && (
              <motion.span
                key="icon"
                className="overflow-visible flex flex-col items-center"
                {...slot}
              >
                <span
                  className="relative flex items-center justify-center w-20 h-16 mb-2.5 overflow-visible"
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute w-11 h-14 rounded-2xl bg-neutral-200/90 dark:bg-[#202024] border border-neutral-300 dark:border-white/10 origin-bottom shadow-xs"
                    animate={
                      dragging
                        ? { rotate: -20, x: -18, y: -1 }
                        : hovered
                          ? { rotate: -16, x: -15, y: -1 }
                          : { rotate: -9, x: -9, y: 0 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 24,
                      mass: 0.8,
                    }}
                  />
                  <motion.span
                    className="absolute w-11 h-14 rounded-2xl bg-neutral-200/90 dark:bg-[#202024] border border-neutral-300 dark:border-white/10 origin-bottom shadow-xs"
                    animate={
                      dragging
                        ? { rotate: 20, x: 18, y: -1 }
                        : hovered
                          ? { rotate: 16, x: 15, y: -1 }
                          : { rotate: 9, x: 9, y: 0 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 24,
                      mass: 0.8,
                    }}
                  />
                  <motion.span
                    className="relative z-10 w-11 h-14 rounded-2xl bg-white dark:bg-[#26262a] border border-neutral-300 dark:border-white/15 shadow-sm flex flex-col items-center justify-center gap-1.5"
                    animate={
                      dragging
                        ? { y: -3, scale: 1.03 }
                        : hovered
                          ? { y: -2, scale: 1.02 }
                          : { y: 0, scale: 1 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 24,
                      mass: 0.8,
                    }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="w-5 h-0.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                      <span className="w-3 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    </div>
                    <ArrowUp
                      size={14}
                      strokeWidth={2.25}
                      className="text-neutral-700 dark:text-neutral-200 mt-0.5"
                    />
                  </motion.span>
                </span>
              </motion.span>
            )}
          </AnimatePresence>
          <strong className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            <TextSwap
              text={dragging ? dropCopy : label}
              className="inline-block"
              reduce={reduce}
            />
          </strong>
          <span
            id={descriptionId}
            className="text-sm text-neutral-500 dark:text-neutral-400 mt-1"
          >
            {description}
          </span>
          <AnimatePresence initial={false}>
            {!compact && (
              <motion.span
                key="note"
                className="overflow-hidden flex flex-col items-center"
                {...slot}
              >
                <small
                  id={noteId}
                  className="text-xs text-neutral-500 dark:text-neutral-500 mt-2 font-normal"
                >
                  {noteCopy}
                </small>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        {inside && list}
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <AnimatePresence initial={false}>
        {error ? <ErrorRow key="error" text={error} /> : null}
      </AnimatePresence>
      {!inside && list}
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

export default FileDropzone;
