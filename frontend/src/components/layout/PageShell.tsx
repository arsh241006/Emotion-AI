import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface Props {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function PageShell({ children, eyebrow, title, description }: Props) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {(eyebrow || title || description) && (
          <div className="mb-10 border-b border-border pb-8">
            {eyebrow && (
              <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </div>
            )}
            {title && <h1 className="text-3xl text-text-primary md:text-4xl">{title}</h1>}
            {description && (
              <p className="mt-3 max-w-2xl text-sm text-text-secondary">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
