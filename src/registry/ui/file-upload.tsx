"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type FileUploadStatus =
  | "queued"
  | "uploading"
  | "success"
  | "error"
  | "cancelled";

export type FileUploadLayout = "full" | "compact";

export interface FileUploadItem {
  id: string;
  file: File;
  progress: number;
  status: FileUploadStatus;
  error?: string;
  retryable?: boolean;
}

export interface FileUploadProps {
  uploadFile: (
    file: File,
    onProgress: (progress: number) => void,
    signal: AbortSignal,
  ) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  layout?: FileUploadLayout;
  accent?: string;
  disabled?: boolean;
  className?: string;
  onFilesChange?: (items: FileUploadItem[]) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const acceptsFile = (file: File, accept?: string) => {
  if (!accept) return true;
  return accept.split(",").some((entry) => {
    const rule = entry.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function UploadIcon({
  open,
  compact = false,
  accent,
}: {
  open: boolean;
  compact?: boolean;
  accent: string;
}) {
  const iconRef = React.useRef<SVGSVGElement>(null);
  const flapRef = React.useRef<SVGPathElement>(null);
  const mouthRef = React.useRef<SVGPathElement>(null);
  const shadowRef = React.useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const flap = flapRef.current;
      const mouth = mouthRef.current;
      const shadow = shadowRef.current;
      if (!flap || !mouth || !shadow) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = reduceMotion ? 0 : open ? 0.34 : 0.3;

      gsap.to(flap, {
        y: open ? 18 : 0,
        scaleY: open ? 0.58 : 1,
        transformOrigin: "50% 100%",
        duration,
        ease: open ? "back.out(1.7)" : "power3.inOut",
        overwrite: "auto",
      });
      gsap.to(mouth, {
        opacity: open ? 1 : 0,
        y: open ? 0 : 5,
        duration: reduceMotion ? 0 : open ? 0.18 : 0.26,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      gsap.to(shadow, {
        x: open ? 1 : 0,
        y: open ? 2 : 0,
        duration,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    { scope: iconRef, dependencies: [open] },
  );

  return (
    <svg
      ref={iconRef}
      viewBox="0 0 128 104"
      aria-hidden="true"
      className={cn(compact ? "h-10 w-14" : "h-20 w-28", "overflow-visible")}
      fill="none"
    >
      <g ref={shadowRef} transform="translate(4 5)" fill="#737373" opacity="0.72">
        <path d="M18 26h34l10 11h48v50H18z" />
        <path d="M14 43h100l-7 46H21z" />
      </g>
      <path
        d="M18 26h34l10 11h48v50H18z"
        fill="#050505"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        ref={mouthRef}
        d="M22 45h84l-6 12H28z"
        fill={accent}
        stroke="white"
        strokeWidth="1.25"
        opacity="0"
        style={{ filter: `drop-shadow(0 0 8px ${accent})` }}
      />
      <path
        ref={flapRef}
        d="M14 43h100l-7 46H21z"
        fill="#050505"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileRow({
  item,
  accent,
  onCancel,
  onRetry,
  onRemove,
}: {
  item: FileUploadItem;
  accent: string;
  onCancel: () => void;
  onRetry: () => void;
  onRemove: () => void;
}) {
  const uploading = item.status === "uploading" || item.status === "queued";

  return (
    <li className="rounded-xl border border-border/80 bg-background/80 p-2.5 dark:border-white/10 dark:bg-black/20">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "size-2 shrink-0 rounded-full",
            uploading && "animate-pulse",
            item.status === "success" && "bg-emerald-500",
            (item.status === "error" || item.status === "cancelled") && "bg-red-500",
          )}
          style={uploading ? { backgroundColor: accent } : undefined}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{item.file.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {formatBytes(item.file.size)}
            {item.status === "success" && " · Uploaded"}
            {item.status === "cancelled" && " · Cancelled"}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {item.status === "success" ? "100%" : `${Math.round(item.progress)}%`}
        </span>
        {uploading && <Button type="button" variant="ghost" size="sm" className="h-7 px-2.5" onClick={onCancel}>Cancel</Button>}
        {(item.status === "error" || item.status === "cancelled") && item.retryable && (
          <Button type="button" variant="outline" size="sm" className="h-7 px-2.5" onClick={onRetry}>Retry</Button>
        )}
        {!uploading && <Button type="button" variant="ghost" size="sm" className="h-7 px-2.5" onClick={onRemove}>Remove</Button>}
      </div>
      <div
        role="progressbar"
        aria-label={`Upload progress for ${item.file.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(item.progress)}
        className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width,background-color] duration-200",
            item.status === "success" && "bg-emerald-500",
            (item.status === "error" || item.status === "cancelled") && "bg-red-500",
          )}
          style={{
            width: `${item.progress}%`,
            backgroundColor: uploading ? accent : undefined,
          }}
        />
      </div>
      {item.error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{item.error}</p>}
    </li>
  );
}

export function FileUpload({
  uploadFile,
  accept,
  multiple = true,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  layout = "full",
  accent = "#F97316",
  disabled = false,
  className,
  onFilesChange,
}: FileUploadProps) {
  const compact = layout === "compact";
  const inputRef = React.useRef<HTMLInputElement>(null);
  const controllersRef = React.useRef(new Map<string, AbortController>());
  const mountedRef = React.useRef(true);
  const dragDepthRef = React.useRef(0);
  const [items, setItems] = React.useState<FileUploadItem[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [iconOpen, setIconOpen] = React.useState(false);

  React.useEffect(() => {
    onFilesChange?.(items);
  }, [items, onFilesChange]);

  React.useEffect(() => {
    mountedRef.current = true;
    const controllers = controllersRef.current;
    return () => {
      mountedRef.current = false;
      controllers.forEach((controller) => controller.abort());
    };
  }, []);

  const openIcon = React.useCallback(() => {
    if (!disabled) setIconOpen(true);
  }, [disabled]);

  const updateItem = React.useCallback((id: string, patch: Partial<FileUploadItem>) => {
    if (!mountedRef.current) return;
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }, []);

  const startUpload = React.useCallback(async (item: FileUploadItem) => {
    const controller = new AbortController();
    controllersRef.current.set(item.id, controller);
    updateItem(item.id, { status: "uploading", progress: 0, error: undefined, retryable: true });

    try {
      await uploadFile(
        item.file,
        (progress) => updateItem(item.id, { progress: Math.min(100, Math.max(0, progress)) }),
        controller.signal,
      );
      if (!controller.signal.aborted) updateItem(item.id, { status: "success", progress: 100, error: undefined });
    } catch (error) {
      if (controller.signal.aborted) {
        updateItem(item.id, { status: "cancelled", error: "Upload cancelled.", retryable: true });
      } else {
        updateItem(item.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed. Try again.",
          retryable: true,
        });
      }
    } finally {
      controllersRef.current.delete(item.id);
    }
  }, [updateItem, uploadFile]);

  const addFiles = React.useCallback((files: File[]) => {
    if (disabled || files.length === 0) return;
    const available = Math.max(0, maxFiles - items.length);
    const selected = multiple ? files : files.slice(0, 1);
    const next = selected.map<FileUploadItem>((file, index) => {
      const base = { id: createId(), file, progress: 0 };
      if (index >= available) return { ...base, status: "error", error: `You can upload up to ${maxFiles} files.`, retryable: false };
      if (file.size > maxSize) return { ...base, status: "error", error: `File exceeds the ${formatBytes(maxSize)} limit.`, retryable: false };
      if (!acceptsFile(file, accept)) return { ...base, status: "error", error: "This file type is not accepted.", retryable: false };
      return { ...base, status: "queued", retryable: true };
    });

    setItems((current) => [...current, ...next]);
    next.filter((item) => item.status === "queued").forEach(startUpload);
    if (inputRef.current) inputRef.current.value = "";
  }, [accept, disabled, items.length, maxFiles, maxSize, multiple, startUpload]);

  const cancel = (id: string) => controllersRef.current.get(id)?.abort();
  const retry = (item: FileUploadItem) => startUpload(item);
  const remove = (id: string) => {
    controllersRef.current.get(id)?.abort();
    controllersRef.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  };
  const openPicker = () => !disabled && inputRef.current?.click();

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Choose files to upload"
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onPointerEnter={openIcon}
        onPointerLeave={() => setIconOpen(false)}
        onFocus={openIcon}
        onBlur={() => setIconOpen(false)}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) return;
          dragDepthRef.current += 1;
          setDragging(true);
          openIcon();
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepthRef.current -= 1;
          if (dragDepthRef.current <= 0) {
            dragDepthRef.current = 0;
            setDragging(false);
            setIconOpen(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepthRef.current = 0;
          setDragging(false);
          setIconOpen(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
        style={
          iconOpen
            ? {
                borderColor: accent,
                boxShadow: dragging ? `0 0 0 3px ${accent}22` : undefined,
              }
            : undefined
        }
        className={cn(
          "group rounded-2xl border-2 [border-style:dotted] border-border bg-card/55 text-center outline-none transition-[border-color,background-color,box-shadow,padding] duration-200",
          compact ? "px-4 py-3" : "px-6 py-7",
          "hover:border-foreground/45 hover:bg-card focus-visible:border-foreground/55 focus-visible:ring-2 focus-visible:ring-foreground/20",
          dragging && "bg-foreground/3",
          disabled && "pointer-events-none opacity-45",
        )}
      >
        <div className={cn(
          "mx-auto flex items-center",
          compact ? "max-w-none flex-row gap-3" : "max-w-sm flex-col",
        )}>
          <div className="opacity-55 saturate-50 transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:saturate-100 group-focus-visible:opacity-100 group-focus-visible:saturate-100">
            <UploadIcon open={iconOpen} compact={compact} accent={accent} />
          </div>
          <div className={cn(compact && "min-w-0 flex-1 text-left")}>
            <p className={cn("text-sm font-medium text-foreground", !compact && "mt-2")}>
              {items.length ? "Add more files" : compact ? "Add files" : "Drop files here to upload"}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {maxFiles} files · {formatBytes(maxSize)} max
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("shrink-0", !compact && "mt-4")}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              openPicker();
            }}
          >
            {compact ? "Browse" : "Browse files"}
          </Button>
        </div>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Selected files">
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              accent={accent}
              onCancel={() => cancel(item.id)}
              onRetry={() => retry(item)}
              onRemove={() => remove(item.id)}
            />
          ))}
        </ul>
      )}
      <div className="sr-only" aria-live="polite">
        {items.map((item) => `${item.file.name}: ${item.status}`).join(". ")}
      </div>
    </div>
  );
}

FileUpload.displayName = "FileUpload";

export default FileUpload;
