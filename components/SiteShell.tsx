"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { checkHealth } from "@/lib/api";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`transition-colors ${
        active
          ? "text-[var(--ink)]"
          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
      }`}
    >
      {label}
      {active && <span className="block h-px bg-[var(--ink)] mt-1 w-full" />}
    </Link>
  );
}

function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  useEffect(() => {
    let mounted = true;
    async function ping() {
      try {
        await checkHealth();
        if (mounted) setStatus("online");
      } catch {
        if (mounted) setStatus("offline");
      }
    }
    ping();
    const interval = setInterval(ping, 30000); // re-check every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const colors = {
    checking: "bg-[var(--ink-muted)]",
    online: "bg-emerald-600",
    offline: "bg-red-500",
  };

  const labels = {
    checking: "Checking API...",
    online: "API connected",
    offline: "API offline",
  };

  return (
    <div
      className="hidden md:flex items-center gap-2 text-xs text-[var(--ink-muted)]"
      title={labels[status]}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${colors[status]} ${
          status === "online" ? "animate-pulse" : ""
        }`}
      />
      <span>{labels[status]}</span>
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBackHome = pathname !== "/";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <nav className="relative z-10 border-b border-[var(--line)] bg-[var(--cream)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[var(--cream-light)] border border-[var(--line)] rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5 L19 19"
                  stroke="#2A2520"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M19 5 Q 12 12, 5 19"
                  stroke="#B89876"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-serif text-2xl tracking-tight">Cosnetix</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 text-sm">
              <NavLink href="/papers" label="Research" />
              <NavLink href="/microbes" label="Microbes" />
              <NavLink href="/recommendations" label="Recommendations" />
              <NavLink href="/about" label="About" />
            </div>
            <ApiStatus />
          </div>
        </div>
      </nav>

      {showBackHome && (
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-5 -mb-2">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>
      )}

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-[var(--line)] mt-12 bg-[var(--cream)]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs text-[var(--ink-muted)]">
            <div>
              Research preview · Not medical advice · Saaketh Katikareddy,
              Artin Seyrafi, Hamza Rafeeq
            </div>
            <div>© 2026 Cosnetix</div>
          </div>
        </div>
      </footer>
    </div>
  );
}