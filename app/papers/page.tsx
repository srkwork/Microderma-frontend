"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { listPapers } from "@/lib/api";
import type { PaperSummary } from "@/lib/types";

export default function PapersPage() {
  const [papers, setPapers] = useState<PaperSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("");

  useEffect(() => {
    loadPapers();
  }, []);

  async function loadPapers() {
    setLoading(true);
    setError("");
    try {
      const data = await listPapers({ limit: 200 });
      setPapers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not load papers. ${err.message}`
          : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = papers.filter((p) => {
    if (
      searchTerm &&
      !p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(p.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ) {
      return false;
    }
    if (yearFilter && String(p.publication_year) !== yearFilter) {
      return false;
    }
    return true;
  });

  const years = Array.from(
    new Set(papers.map((p) => p.publication_year).filter(Boolean))
  )
    .sort((a, b) => (b as number) - (a as number))
    .slice(0, 12);

  return (
    <SiteShell>
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
            Research database
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-5 tracking-tight leading-[1.05]">
            The papers behind <em className="italic text-[var(--accent)]">every recommendation</em>
          </h1>
          <p className="text-lg text-[var(--ink-soft)] leading-relaxed max-w-2xl">
            {papers.length} peer-reviewed studies on the human skin microbiome,
            normalized into a queryable evidence database.
          </p>
        </Reveal>
      </section>

      {/* Filters */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <Reveal delay={150}>
          <div className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by title or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white border border-[var(--line)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-white border border-[var(--line)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--ink)] transition-colors min-w-[140px]"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
            {(searchTerm || yearFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setYearFilter("");
                }}
                className="btn-secondary px-4 py-2.5 rounded-lg text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </Reveal>
      </section>

      {/* Results header */}
      <section className="max-w-5xl mx-auto px-6 pb-3">
        <div className="flex justify-between text-xs uppercase tracking-widest text-[var(--ink-muted)]">
          <span>
            {loading
              ? "Loading..."
              : `${filtered.length} ${filtered.length === 1 ? "paper" : "papers"}`}
          </span>
          {!loading && filtered.length !== papers.length && (
            <span>Showing {filtered.length} of {papers.length}</span>
          )}
        </div>
      </section>

      {/* Papers list */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {error && (
          <div className="text-sm text-[var(--ink)] bg-[var(--cream-dark)] border border-[var(--line)] rounded-lg p-4 mb-4">
            <strong className="font-medium">Connection error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <PaperSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((paper, i) => (
              <PaperCard key={paper.paper_id} paper={paper} index={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-16 text-[var(--ink-muted)]">
            <p className="font-serif text-2xl italic mb-3">No papers match.</p>
            <p className="text-sm">Try a different search term.</p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function PaperCard({ paper, index }: { paper: PaperSummary; index: number }) {
  return (
    <Link href={`/papers/${paper.paper_id}`}>
      <div
        className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-6 card-hover cursor-pointer"
        style={{
          animation: `fadeUp 0.4s ease-out ${Math.min(index * 0.05, 0.5)}s backwards`,
        }}
      >
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
            #{paper.paper_id}
            {paper.publication_year && ` · ${paper.publication_year}`}
            {paper.journal && ` · ${paper.journal}`}
          </div>
        </div>
        <h3 className="font-serif text-xl leading-snug mb-2">
          {paper.title}
        </h3>
        {paper.authors && (
          <p className="text-sm text-[var(--ink-soft)] line-clamp-1">
            {paper.authors}
          </p>
        )}
        {paper.doi && (
          <p className="text-xs text-[var(--ink-muted)] mt-2 font-mono">
            DOI: {paper.doi}
          </p>
        )}
      </div>
    </Link>
  );
}

function PaperSkeleton() {
  return (
    <div className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-6 animate-pulse">
      <div className="h-3 bg-[var(--cream-dark)] rounded w-1/3 mb-3"></div>
      <div className="h-5 bg-[var(--cream-dark)] rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-[var(--cream-dark)] rounded w-1/2"></div>
    </div>
  );
}