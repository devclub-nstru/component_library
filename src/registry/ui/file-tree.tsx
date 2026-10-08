"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  data?: unknown;
  disabled?: boolean;
};

export type TreeViewProps = {
  data: TreeNode[];
  className?: string;
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
  expandOnFolderClick?: boolean;
};

export function TreeView({
  data,
  className,
  onNodeClick,
  onNodeExpand,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedIdsChange,
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  indent = 16,
  animateExpand = true,
  expandOnFolderClick = true,
}: TreeViewProps) {
  const prefersReducedMotion = useReducedMotion();

  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds),
  );

  const isExpandedControlled = controlledExpandedIds !== undefined;
  const currentExpandedSet = useMemo(() => {
    if (isExpandedControlled) {
      return new Set(controlledExpandedIds);
    }
    return internalExpandedIds;
  }, [isExpandedControlled, controlledExpandedIds, internalExpandedIds]);

  const toggleExpanded = useCallback(
    (nodeId: string) => {
      const nextSet = new Set(currentExpandedSet);
      const isExpanded = nextSet.has(nodeId);
      if (isExpanded) {
        nextSet.delete(nodeId);
      } else {
        nextSet.add(nodeId);
      }

      if (!isExpandedControlled) {
        setInternalExpandedIds(nextSet);
      }

      onExpandedIdsChange?.(Array.from(nextSet));
      onNodeExpand?.(nodeId, !isExpanded);
    },
    [
      currentExpandedSet,
      isExpandedControlled,
      onExpandedIdsChange,
      onNodeExpand,
    ],
  );

  const [internalSelectedIds, setInternalSelectedIds] =
    useState<string[]>(defaultSelectedIds);

  const isSelectedControlled = controlledSelectedIds !== undefined;
  const currentSelectedIds = isSelectedControlled
    ? controlledSelectedIds
    : internalSelectedIds;

  const handleSelection = useCallback(
    (nodeId: string, isCtrlKey: boolean) => {
      if (!selectable) return;

      let nextSelection: string[];

      if (multiSelect && isCtrlKey) {
        nextSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        nextSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      if (!isSelectedControlled) {
        setInternalSelectedIds(nextSelection);
      }

      onSelectionChange?.(nextSelection);
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isSelectedControlled,
      onSelectionChange,
    ],
  );

  const visibleNodes = useMemo(() => {
    const list: { node: TreeNode; parentId: string | null }[] = [];
    const walk = (nodes: TreeNode[], parentId: string | null) => {
      for (const node of nodes) {
        list.push({ node, parentId });
        if (node.children?.length && currentExpandedSet.has(node.id)) {
          walk(node.children, node.id);
        }
      }
    };
    walk(data, null);
    return list;
  }, [data, currentExpandedSet]);

  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const tabStopId = useMemo(() => {
    const visibleIds = visibleNodes.map(({ node }) => node.id);
    if (focusedId && visibleIds.includes(focusedId)) return focusedId;
    return (
      visibleIds.find((id) => currentSelectedIds.includes(id)) ??
      visibleIds[0] ??
      null
    );
  }, [visibleNodes, focusedId, currentSelectedIds]);

  const focusNode = useCallback((nodeId: string | null | undefined) => {
    if (!nodeId) return;
    setFocusedId(nodeId);
    itemRefs.current.get(nodeId)?.focus();
  }, []);

  const moveFocus = useCallback(
    (nodeId: string, key: string) => {
      const index = visibleNodes.findIndex(({ node }) => node.id === nodeId);
      if (index === -1) return false;
      const current = visibleNodes[index];
      const hasChildren = (current.node.children?.length ?? 0) > 0;
      const isExpanded = currentExpandedSet.has(nodeId);

      switch (key) {
        case "ArrowDown":
          focusNode(visibleNodes[index + 1]?.node.id);
          return true;
        case "ArrowUp":
          focusNode(visibleNodes[index - 1]?.node.id);
          return true;
        case "Home":
          focusNode(visibleNodes[0]?.node.id);
          return true;
        case "End":
          focusNode(visibleNodes[visibleNodes.length - 1]?.node.id);
          return true;
        case "ArrowRight":
          if (!hasChildren) return false;
          if (isExpanded) focusNode(current.node.children?.[0]?.id);
          else toggleExpanded(nodeId);
          return true;
        case "ArrowLeft":
          if (hasChildren && isExpanded) toggleExpanded(nodeId);
          else focusNode(current.parentId);
          return true;
        default:
          return false;
      }
    },
    [visibleNodes, currentExpandedSet, focusNode, toggleExpanded],
  );

  const handleNodeClick = useCallback(
    (node: TreeNode, e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.disabled) return;

      const hasChildren = (node.children?.length ?? 0) > 0;
      if (hasChildren && expandOnFolderClick) {
        toggleExpanded(node.id);
      }

      handleSelection(node.id, e.ctrlKey || e.metaKey);
      onNodeClick?.(node);
    },
    [expandOnFolderClick, toggleExpanded, handleSelection, onNodeClick],
  );

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isExpanded = currentExpandedSet.has(node.id);
    const isSelected = currentSelectedIds.includes(node.id);

    return (
      <div key={node.id} className="relative">
        <div
          ref={(element) => {
            if (element) itemRefs.current.set(node.id, element);
            else itemRefs.current.delete(node.id);
          }}
          role="treeitem"
          aria-level={level + 1}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={selectable ? isSelected : undefined}
          aria-disabled={node.disabled || undefined}
          tabIndex={node.id === tabStopId ? 0 : -1}
          onFocus={() => setFocusedId(node.id)}
          className={cn(
            "group/node relative flex items-center h-8 px-2 rounded-md cursor-pointer select-none transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
            isSelected
              ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100",
            node.disabled && "opacity-50 pointer-events-none",
          )}
          style={{ paddingLeft: `${level * indent + 8}px` }}
          onClick={(e) => handleNodeClick(node, e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNodeClick(node, e as unknown as React.MouseEvent);
            } else if (moveFocus(node.id, e.key)) {
              e.preventDefault();
            }
          }}
        >
          {showLines && level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 pointer-events-none">
              {Array.from({ length: level }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-zinc-200 dark:border-zinc-800/80"
                  style={{ left: `${i * indent + 15}px` }}
                />
              ))}
            </div>
          )}

          <div className="w-4 h-4 flex items-center justify-center shrink-0 mr-1">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={
                  prefersReducedMotion || !animateExpand
                    ? { duration: 0 }
                    : { duration: 0.15, ease: "easeInOut" }
                }
                className="flex items-center justify-center text-zinc-400 group-hover/node:text-zinc-600 dark:group-hover/node:text-zinc-300"
                onClick={(e) => {
                  if (!expandOnFolderClick) {
                    e.stopPropagation();
                    toggleExpanded(node.id);
                  }
                }}
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </motion.div>
            ) : (
              <span className="w-3.5 h-3.5" />
            )}
          </div>

          {showIcons && (
            <div className="w-4 h-4 flex items-center justify-center shrink-0 mr-2 text-zinc-400 group-hover/node:text-zinc-600 dark:text-zinc-400 dark:group-hover/node:text-zinc-200">
              {node.icon ? (
                node.icon
              ) : hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-amber-500/90 dark:text-amber-400/90" />
                ) : (
                  <Folder className="h-4 w-4 text-amber-500/90 dark:text-amber-400/90" />
                )
              ) : (
                <File className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              )}
            </div>
          )}

          <span className="text-xs sm:text-sm truncate leading-none pt-px">
            {node.label}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition:
                  prefersReducedMotion || !animateExpand
                    ? { duration: 0 }
                    : {
                        height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.15, delay: 0.03 },
                      },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition:
                  prefersReducedMotion || !animateExpand
                    ? { duration: 0 }
                    : {
                        height: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.1 },
                      },
              }}
              role="group"
              className="overflow-hidden"
            >
              {node.children!.map((child) => renderNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      role="tree"
      className={cn(
        "w-full select-none text-zinc-900 dark:text-zinc-100 font-sans",
        className,
      )}
    >
      {data.map((node) => renderNode(node, 0))}
    </div>
  );
}

export const FileTree = TreeView;
