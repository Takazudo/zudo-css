import { useState } from "react";
import type { NavNode } from "@/utils/docs";

interface SiteTreeNavProps {
  tree: NavNode[];
  ariaLabel?: string;
  expandLabel?: string;
  collapseLabel?: string;
}

export default function SiteTreeNav({
  tree,
  ariaLabel = "Site index",
  expandLabel = "Expand",
  collapseLabel = "Collapse",
}: SiteTreeNavProps) {
  return (
    <nav aria-label={ariaLabel} className="grid grid-cols-1 gap-y-vsp-md">
      {tree.map((node) => (
        <SectionCard
          key={node.slug}
          node={node}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
        />
      ))}
    </nav>
  );
}

function SectionCard({
  node,
  expandLabel,
  collapseLabel,
}: {
  node: NavNode;
  expandLabel: string;
  collapseLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="border border-muted rounded overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-surface">
        <div className="flex-1 min-w-0 px-hsp-lg py-vsp-md">
          {node.href ? (
            <a
              href={node.href}
              className="font-medium text-accent hover:underline"
            >
              {node.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={hasChildren ? open : undefined}
              className="font-medium text-accent hover:underline text-left"
            >
              {node.label}
            </button>
          )}
          {node.description && (
            <span className="block text-small text-muted mt-vsp-2xs">
              {node.description}
            </span>
          )}
        </div>
        {hasChildren && (
          <button
            type="button"
            onClick={toggle}
            className="px-hsp-lg py-vsp-md text-muted hover:text-fg shrink-0"
            aria-expanded={open}
            aria-label={`${open ? collapseLabel : expandLabel} ${node.label}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-[1rem] w-[1rem] transition-transform duration-150 ${open ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Children */}
      {open && hasChildren && (
        <div className="border-t border-muted">
          <ChildList
            nodes={node.children}
            depth={0}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
          />
        </div>
      )}
    </div>
  );
}

function SubCategory({
  node,
  depth,
  expandLabel,
  collapseLabel,
}: {
  node: NavNode;
  depth: number;
  expandLabel: string;
  collapseLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const pl = `${depth + 1}rem`;

  return (
    <div>
      <div
        className="flex items-center border-t border-muted first:border-t-0"
        style={{ paddingLeft: pl }}
      >
        <div className="flex-1 min-w-0 py-vsp-xs pr-hsp-md">
          {node.href ? (
            <a
              href={node.href}
              className="text-small font-medium text-fg hover:text-accent hover:underline"
            >
              {node.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              className="text-small font-medium text-fg hover:text-accent hover:underline text-left"
            >
              {node.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="px-hsp-md py-vsp-xs text-muted hover:text-fg shrink-0"
          aria-expanded={open}
          aria-label={`${open ? collapseLabel : expandLabel} ${node.label}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-[0.75rem] w-[0.75rem] transition-transform duration-150 ${open ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {open && (
        <ChildList
          nodes={node.children}
          depth={depth + 1}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
        />
      )}
    </div>
  );
}

function ChildList({
  nodes,
  depth,
  expandLabel,
  collapseLabel,
}: {
  nodes: NavNode[];
  depth: number;
  expandLabel: string;
  collapseLabel: string;
}) {
  const pl = `${depth + 1}rem`;

  return (
    <>
      {nodes.map((child) =>
        child.children.length > 0 ? (
          <SubCategory
            key={child.slug}
            node={child}
            depth={depth}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
          />
        ) : child.href ? (
          <div
            key={child.slug}
            className="border-t border-muted first:border-t-0"
            style={{ paddingLeft: pl }}
          >
            <a
              href={child.href}
              className="block py-vsp-xs pr-hsp-md text-small text-muted hover:text-accent hover:underline"
            >
              {child.label}
            </a>
          </div>
        ) : null,
      )}
    </>
  );
}
