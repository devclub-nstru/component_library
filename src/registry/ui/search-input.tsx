"use client";

import { useEffect, useRef, useState } from "react";
import { VoiceBeam } from "voice-glow";
import { Orb } from "./fx/Orb";

export type SearchComposerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  onClear?: () => void;
  busy?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
};

export function SearchComposer({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSubmit,
  onClear,
  busy = false,
  placeholder = "What are we overthinking today?",
  className,
  autoFocus = true,
}: SearchComposerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const input = useRef<HTMLInputElement>(null);
  const energy = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    let raf = 0;
    const tick = () => {
      energy.current *= 0.91;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const typed = input.current?.value;
    if (typed && typed !== currentValue) {
      if (!isControlled) {
        setInternalValue(typed);
      }
      onChange?.(typed);
    }
  }, [currentValue, isControlled, onChange]);

  const submit = () => onSubmit?.(input.current?.value ?? currentValue);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = document.activeElement instanceof HTMLInputElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const form = (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex w-full items-center gap-3 rounded-[5px] border border-line bg-panel/95 py-3 pl-6 pr-3 backdrop-blur-2xl transition-colors duration-300 focus-within:border-line-strong"
    >
      <label htmlFor="q" className="sr-only">
        Describe an image
      </label>
      <input
        id="q"
        ref={input}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        maxLength={300}
        value={currentValue}
        onChange={(e) => {
          energy.current = Math.min(1, energy.current + 0.5);
          if (!isControlled) {
            setInternalValue(e.target.value);
          }
          onChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") {
            if (!isControlled) {
              setInternalValue("");
            }
            onClear?.();
            input.current?.blur();
          }
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-2 text-[18px] leading-8 tracking-[-0.01em] text-text outline-none placeholder:text-faint"
      />
      <button
        type="submit"
        disabled={busy || currentValue.trim().length < 2}
        aria-label={busy ? "Searching" : "Search"}
        className="grid size-12 shrink-0 place-items-center rounded-[5px] border border-line transition-all duration-300 ease-out enabled:hover:border-line-strong enabled:hover:bg-white/6 enabled:active:scale-95 disabled:opacity-45"
      >
        <Orb
          state={busy ? "searching" : "breathing"}
          size={64}
          display={30}
          interactive={false}
        />
      </button>
    </form>
  );

  if (!ready) return form;

  return (
    <VoiceBeam
      type="default"
      theme="dark"
      colorVariant="colorful"
      level={() => energy.current}
      processing={busy}
      strength={0.9}
      className={className ? `w-full ${className}` : "w-full"}
    >
      {form}
    </VoiceBeam>
  );
}

export const SearchInput = SearchComposer;
export type SearchInputProps = SearchComposerProps;
export { Orb, type OrbProps } from "./fx/Orb";
