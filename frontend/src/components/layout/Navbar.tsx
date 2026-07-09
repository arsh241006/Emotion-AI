import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import { Logo } from "./Logo";


const NAV = [
  { to: "/", label: "Overview" },
  { to: "/predict", label: "Predict" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/model", label: "Model" },
  { to: "/dataset", label: "Dataset" },
  { to: "/api", label: "API" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="EmotionAI home">
          <svg width="24" height="24" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="15" fill="none" stroke="#2A2A2E" strokeWidth="5" />
            <circle
              cx="22" cy="22" r="15" fill="none"
              stroke="#FF6A1A" strokeWidth="5"
              strokeDasharray="94.2" strokeDashoffset="66"
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
            <circle cx="22" cy="22" r="3.5" fill="#F5F5F5" />
          </svg>
          <span className="mono text-sm tracking-tight text-text-primary">EmotionAI</span>
          <span className="mono text-[10px] uppercase tracking-widest text-text-tertiary">v0.1</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary hover:bg-surface-raised"
              activeProps={{ className: cn("!text-text-primary bg-surface-raised") }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-strong px-2.5 text-xs text-text-secondary hover:text-text-primary"
        >
          <Github className="h-3.5 w-3.5" aria-hidden="true" />
          GitHub
        </a>
      </div>
    </header>
  );
}
