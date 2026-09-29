# File Upload Component Design

## Objective

Add a reusable `FileUpload` component to the DevClub component library. It provides drag-and-drop and file-picker input, visible per-file upload progress, retry and cancellation controls, and a hand-drawn upload icon whose motion is based on the supplied recording.

The component must fit the existing registry architecture, be previewable in Component Studio, reuse repository components wherever possible, and add no dependency unless the existing stack cannot provide required behavior.

## Visual Direction

The dropzone is a quiet, premium surface with a dotted border. At rest, the icon, label, supporting copy, and border use muted theme colors. Hover, keyboard focus, and drag-over increase contrast without changing the layout.

The upload icon is an original inline SVG derived from the visual construction in the reference recording:

- A coral arrow with a slightly offset coral shadow.
- Navy or theme-derived hand-drawn outlines.
- A curved upload tray beneath the arrow.
- Short sketch strokes that trail the arrow during movement.

The SVG is local to the component because the registry has no matching icon. It is not imported from an external icon package.

## Icon Motion

GSAP and `@gsap/react`, already installed in the repository, drive a scoped timeline.

The animation runs once when the dropzone receives pointer hover, keyboard focus, or drag-over:

1. The arrow compresses slightly and descends into the tray.
2. The arrow becomes hidden behind the tray while the tray remains visible.
3. The arrow rises out of the tray with a small overshoot.
4. Offset and sketch accent strokes briefly trail the rising arrow.
5. The arrow settles into its resting position and the timeline stops.

The animation does not loop continuously. Pointer movement inside the active dropzone does not restart it. A new pointer cycle becomes available after pointer leave; keyboard focus and a new drag entry may also trigger one cycle. Upload progress does not continuously animate the icon.

With `prefers-reduced-motion: reduce`, the travel sequence is skipped. Hover, focus, and drag-over contrast changes remain visible.

## Component API

```ts
export type FileUploadStatus =
  | "queued"
  | "uploading"
  | "success"
  | "error"
  | "cancelled";

export interface FileUploadItem {
  id: string;
  file: File;
  progress: number;
  status: FileUploadStatus;
  error?: string;
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
  disabled?: boolean;
  className?: string;
  onFilesChange?: (items: FileUploadItem[]) => void;
}
```

Defaults:

- `multiple`: `true`
- `maxFiles`: `5`
- `maxSize`: `10 * 1024 * 1024`
- `disabled`: `false`

The component owns transient upload state. Consumers provide the upload transport through `uploadFile`, keeping the component backend-agnostic. `AbortSignal` enables real cancellation. Progress callbacks are clamped to `0–100`.

## Interaction and State Flow

### Empty state

The dotted dropzone contains the animated icon, a concise upload label, accepted-file guidance, and a repository `Button` for browsing. Clicking the dropzone or Browse button opens a native hidden file input.

### Drag-over state

The dropzone border and foreground increase in contrast. The icon performs one animation cycle. Native drag events prevent browser navigation and accept dropped files.

### Validation

Files are rejected before upload when they exceed `maxSize`, exceed `maxFiles`, or do not match `accept`. Rejected entries display a concise error and remain removable. Valid files begin uploading immediately.

### Uploading state

Each file renders a compact row containing:

- File name and formatted size.
- Numeric percentage.
- Accessible progress bar.
- Cancel action using the repository `Button`.

The progress bar uses native HTML and repository styling; no external progress component is introduced.

### Success state

The row displays completion state and a Remove action. Status is announced through a polite live region.

### Error or cancelled state

The row displays the message plus Retry and Remove actions. Retry creates a fresh `AbortController` and calls the same `uploadFile` callback.

### Additional files

When rows exist, the full empty-state prompt becomes a compact “Add files” action so progress remains primary.

## Repository Reuse

- Use `Button` from `@/components/ui/button` for Browse, Add files, Cancel, Retry, and Remove.
- Use `cn` from `@/lib/utils` for class composition.
- Use GSAP and `useGSAP` following the repository skills for animation and cleanup.
- Use native file input, drag events, progress semantics, and `AbortController`.
- Use existing color variables, typography, spacing, focus rings, light/dark tokens, and Component Studio patterns.
- Do not add a third-party uploader, icon package, progress package, state library, or animation dependency.

Existing components that do not fit the interaction will not be forced into the implementation. In particular, `TaskList` is task-specific and is not reused for upload rows.

## Files and Registry Integration

Implementation will add or update only the files required by the existing registry flow:

- `src/registry/ui/file-upload.tsx`
- `src/registry/components/file-upload.json`
- Component registry indexes generated through the existing sync workflow.
- `src/components/showcase/component-studio.tsx` for the interactive simulated-upload preview.
- Component catalog metadata required by the current project architecture.

The preview uses a deterministic simulated uploader with progress, success, cancellation, and a predictable error case. Simulation remains in the showcase and is not bundled into the reusable component.

## Accessibility

- The dropzone is keyboard reachable and operable with Enter or Space.
- Browse uses a native file input.
- Drag-and-drop is an enhancement, not the only input path.
- Progress exposes `role="progressbar"` with current, minimum, and maximum values.
- File-state changes are announced through an `aria-live="polite"` region.
- Every icon-only action has an accessible label.
- Focus-visible treatment follows existing repository conventions.
- Disabled state blocks picker, drag, retry, and animation interactions.
- Reduced motion removes the icon travel animation.

## Error Handling

- Synchronous throws and rejected upload promises move the item to `error`.
- Abort errors move the item to `cancelled` without presenting them as network failures.
- Progress values outside the expected range are clamped.
- Component unmount aborts active uploads and kills scoped GSAP timelines.
- Removing an uploading file aborts it before removing the row.

## Verification

Implementation is complete when:

- TypeScript, lint, registry sync, and `git diff --check` pass.
- The preview supports file selection and drag-and-drop.
- The icon runs exactly once per hover/focus/drag-entry cycle and stops after the arrow rises and settles.
- The component remains muted at rest and uses a dotted border.
- Progress, success, error, retry, cancel, and removal states are visible and functional.
- Keyboard operation, focus visibility, live announcements, and reduced motion are verified.
- Desktop, tablet, and mobile preview layouts remain usable.
- No new dependency is added.
