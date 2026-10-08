"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, FileSpreadsheet, FileText, Minus, Trash2 } from "lucide-react";
import { ConfirmMorph } from "./confirm-morph";
import { cn } from "@/lib/utils";

export const deleteFiles = async (ids: string[]) => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return ids;
};

export const restoreFiles = async (ids: string[]) => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return ids;
};

export interface DeleteSelectionProps {
  ids: string[];
  onConfirm?: (ids: string[]) => void | Promise<unknown>;
  onUndo?: (ids: string[]) => void | Promise<unknown>;
  disabled?: boolean;
}

export function DeleteSelection({
  ids,
  onConfirm,
  onUndo,
  disabled,
}: DeleteSelectionProps) {
  const count = ids.length;
  const promptText = `Delete ${count} ${count === 1 ? "file" : "files"}?`;

  return (
    <ConfirmMorph
      label="Delete"
      icon={<Trash2 size={16} strokeWidth={1.75} />}
      prompt={promptText}
      tone="danger"
      disabled={disabled || count === 0}
      onConfirm={() => (onConfirm ? onConfirm(ids) : deleteFiles(ids))}
      onUndo={() => (onUndo ? onUndo(ids) : restoreFiles(ids))}
    />
  );
}

interface FileItem {
  id: string;
  name: string;
  author: string;
  date: string;
  size: string;
  type: "image" | "pdf" | "sheet";
  thumbnail?: string;
}

const INITIAL_FILES: FileItem[] = [
  {
    id: "1",
    name: "pookie virat 01.jpg",
    author: "Pookie Virat",
    date: "Sep 21",
    size: "4.2 MB",
    type: "image",
    thumbnail:
      "https://i.pinimg.com/736x/1d/49/b5/1d49b5da4ebfc59d5d7d4f1c288ecf17.jpg",
  },
  {
    id: "2",
    name: "pookie virat 02.jpg",
    author: "Pookie Virat",
    date: "Sep 20",
    size: "3.8 MB",
    type: "image",
    thumbnail:
      "https://i.pinimg.com/1200x/63/01/21/630121fe689e8d2c43b0b10180d31f84.jpg",
  },
  {
    id: "3",
    name: "pookie virat 03.jpg",
    author: "Pookie Virat",
    date: "Sep 19",
    size: "5.1 MB",
    type: "image",
    thumbnail:
      "https://i.pinimg.com/736x/54/cc/b5/54ccb5138e6452e45dcec18aee7b9f39.jpg",
  },
  {
    id: "4",
    name: "pookie virat 04.jpg",
    author: "Pookie Virat",
    date: "Sep 18",
    size: "2.9 MB",
    type: "image",
    thumbnail:
      "https://i.pinimg.com/736x/25/4b/0b/254b0b03a39fc3736053c28263fa5053.jpg",
  },
  {
    id: "5",
    name: "pookie virat 05.jpg",
    author: "Pookie Virat",
    date: "Sep 17",
    size: "4.6 MB",
    type: "image",
    thumbnail:
      "https://i.pinimg.com/736x/78/68/5e/78685eb464deaa7a7cc9cad4b12e9ef9.jpg",
  },
];

export function DeleteSelectionShowcase() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [selectedIds, setSelectedIds] = useState<string[]>(["2", "3"]);
  const [outcome, setOutcome] = useState<"succeeds" | "fails">("succeeds");
  const [lastDeleted, setLastDeleted] = useState<{
    items: FileItem[];
    ids: string[];
  } | null>(null);

  const highlightRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    const el = itemRefs.current[index];
    const hl = highlightRef.current;
    if (!el || !hl) return;
    hl.style.transform = `translate3d(${el.offsetLeft}px, ${el.offsetTop}px, 0)`;
    hl.style.width = `${el.offsetWidth}px`;
    hl.style.height = `${el.offsetHeight}px`;
    hl.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    const hl = highlightRef.current;
    if (!hl) return;
    hl.style.opacity = "0";
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map((f) => f.id));
    }
  };

  const handleConfirm = async (ids: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (outcome === "fails") {
      throw new Error("Failed to delete files");
    }
    const removed = files.filter((f) => ids.includes(f.id));
    setLastDeleted({ items: removed, ids });
    setFiles((prev) => prev.filter((f) => !ids.includes(f.id)));
    setSelectedIds([]);
    handleMouseLeave();
  };

  const handleUndo = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (lastDeleted) {
      setFiles((prev) => {
        const merged = [...prev];
        for (const item of lastDeleted.items) {
          if (!merged.some((m) => m.id === item.id)) {
            merged.push(item);
          }
        }
        return merged.sort(
          (a, b) =>
            INITIAL_FILES.findIndex((f) => f.id === a.id) -
            INITIAL_FILES.findIndex((f) => f.id === b.id),
        );
      });
      setSelectedIds(lastDeleted.ids);
      setLastDeleted(null);
    }
  };

  const isAllSelected = files.length > 0 && selectedIds.length === files.length;
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < files.length;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="w-full rounded-[26px] bg-[#161618] border border-white/8 p-5 shadow-2xl transition-all">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {files.length > 0 && (
                <motion.button
                  key="select-all-btn"
                  type="button"
                  role="checkbox"
                  aria-checked={
                    isAllSelected ? true : isPartiallySelected ? "mixed" : false
                  }
                  aria-label={
                    isAllSelected ? "Deselect all files" : "Select all files"
                  }
                  initial={{ scale: 0, opacity: 0, width: 0 }}
                  animate={{ scale: 1, opacity: 1, width: 28 }}
                  exit={{ scale: 0, opacity: 0, width: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  onClick={toggleAll}
                  className="size-7 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center cursor-pointer transition-colors hover:bg-zinc-700/70 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isAllSelected ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        <Check
                          size={14}
                          className="text-zinc-200"
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    ) : isPartiallySelected ? (
                      <motion.div
                        key="minus"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        <Minus
                          size={14}
                          className="text-zinc-200"
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-zinc-100 leading-tight">
                pookie virat
              </span>
              <span className="text-xs text-zinc-400 leading-normal">
                {files.length === 0
                  ? "No files remaining"
                  : `${selectedIds.length} of ${files.length} selected`}
              </span>
            </div>
          </div>

          <DeleteSelection
            ids={selectedIds}
            onConfirm={handleConfirm}
            onUndo={handleUndo}
          />
        </div>

        <div
          onMouseLeave={handleMouseLeave}
          className="relative flex flex-col gap-1 mt-1 min-h-10"
        >
          {files.length > 0 && (
            <div
              ref={highlightRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 rounded-2xl bg-white/[0.07] dark:bg-white/[0.07] border border-white/5 z-0 opacity-0 transition-[transform,width,height,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          )}

          <AnimatePresence mode="popLayout" initial={false}>
            {files.map((file, idx) => {
              const isSelected = selectedIds.includes(file.id);
              return (
                <motion.div
                  layout
                  key={file.id}
                  ref={(node) => {
                    itemRefs.current[idx] = node;
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: -6,
                    transition: { duration: 0.16, ease: [0.2, 0, 0, 1] },
                  }}
                  transition={{
                    layout: { type: "spring", stiffness: 450, damping: 32 },
                    opacity: { duration: 0.18 },
                  }}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onClick={() => toggleSelect(file.id)}
                  className={cn(
                    "group relative z-10 flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-colors duration-150",
                    isSelected
                      ? "bg-zinc-800/80 border border-white/5 shadow-xs"
                      : "border border-transparent",
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        "size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "bg-zinc-200 border-zinc-200 text-zinc-950"
                          : "border-zinc-700 bg-zinc-800/40 group-hover:border-zinc-600",
                      )}
                    >
                      {isSelected && (
                        <Check
                          size={12}
                          strokeWidth={3}
                          className="text-zinc-950"
                        />
                      )}
                    </div>

                    <div className="size-10 rounded-xl overflow-hidden shrink-0 border border-white/10 flex items-center justify-center bg-zinc-800/90 text-zinc-400">
                      {file.type === "image" && file.thumbnail ? (
                        <img
                          src={file.thumbnail}
                          alt={file.name}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : file.type === "pdf" ? (
                        <FileText size={18} className="text-zinc-300" />
                      ) : (
                        <FileSpreadsheet size={18} className="text-zinc-300" />
                      )}
                    </div>

                    <div className="flex flex-col text-left min-w-0 truncate">
                      <span
                        className={cn(
                          "text-sm font-medium leading-snug truncate",
                          isSelected ? "text-zinc-100" : "text-zinc-200",
                        )}
                      >
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-400 truncate">
                        {file.author} · {file.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 font-mono shrink-0 pl-3">
                    {file.size}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {files.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="flex flex-col items-center justify-center py-8 px-4 text-center select-none"
            >
              <div className="size-10 rounded-2xl bg-zinc-800/60 border border-white/10 flex items-center justify-center text-zinc-400 mb-2.5">
                <Trash2 size={18} strokeWidth={1.75} />
              </div>
              <span className="text-sm font-medium text-zinc-200">
                All files deleted
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="relative inline-flex items-center p-1 rounded-full bg-[#161618] border border-white/8 shadow-lg">
          <button
            type="button"
            onClick={() => setOutcome("succeeds")}
            className={cn(
              "relative z-10 px-4 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400",
              outcome === "succeeds"
                ? "text-white"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {outcome === "succeeds" && (
              <motion.div
                layoutId="outcome-slider"
                className="absolute inset-0 rounded-full bg-zinc-800 border border-white/10 shadow-xs -z-10"
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 34,
                  mass: 0.8,
                }}
              />
            )}
            Succeeds
          </button>
          <button
            type="button"
            onClick={() => setOutcome("fails")}
            className={cn(
              "relative z-10 px-4 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400",
              outcome === "fails"
                ? "text-white"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {outcome === "fails" && (
              <motion.div
                layoutId="outcome-slider"
                className="absolute inset-0 rounded-full bg-zinc-800 border border-white/10 shadow-xs -z-10"
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 34,
                  mass: 0.8,
                }}
              />
            )}
            Fails
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSelectionShowcase;
