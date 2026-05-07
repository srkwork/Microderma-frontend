"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { searchMicrobes, getTopMicrobes } from "@/lib/api";
import type { TaxonRecord } from "@/lib/types";

interface TopMicrobe {
  bacterial_species: string;
  paper_count: number;
}

export default function MicrobesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<TaxonRecord[]>([]);
  const [topMicrobes, setTopMicrobes] = useState<TopMicrobe[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTop, setLoadingTop] = useState(true);
  const [error, setError] = useState("");

  // Load top microbes on mount
  useEffect(() => {
    getTopMicrobes(12)
      .then(setTopMicrobes)
      .catch(() => {
        // Top microbes is optional; ignore errors
      })
      .finally(() => setLoadingTop(false));
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchMicrobes({
          name: searchTerm.trim(),
          limit: 50,
        });
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <SiteShell>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
            Microbe explorer
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-5 tracking-tight leading-[1.05]">
            Search the <em className="italic text-[var(--accent)]">microbial taxa</em> behind every study
          </h1>
          <p className="text-lg text-[var(--ink-soft)] leading-relaxed max-w-2xl">
            Look up bacterial species, genera, or higher-level taxa. See which
            papers report them, in what abundance, and under what conditions.
          </p>
        </Reveal>
      </section>

      {/* Search box */}
      <section className="max-w-4xl mx-auto px-6 pb-8">
        <Reveal delay={150}>
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Search microbes... (try Cutibacterium, Staphylococcus, Malassezia)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-[var(--ink)] transition-colors"
            />
            {loading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-[var(--ink-muted)]">
                Searching...
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* Results or top microbes */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        {error && (
          <div className="text-sm text-[var(--ink)] bg-[var(--cream-dark)] border border-[var(--line)] rounded-lg p-4 mb-4">
            <strong className="font-medium">Search error:</strong> {error}
          </div>
        )}

        {/* Search results */}
        {searchTerm.trim() && results.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
              {results.length} {results.length === 1 ? "match" : "matches"} for &quot;{searchTerm}&quot;
            </div>
            <div className="space-y-2">
              {results.map((r, i) => (
                <MicrobeRow key={r.taxa_id} record={r} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {searchTerm.trim() && results.length === 0 && !loading && !error && (
          <div className="text-center py-16 text-[var(--ink-muted)]">
            <p className="font-serif text-2xl italic mb-3">
              No microbes match &quot;{searchTerm}&quot;.
            </p>
            <p className="text-sm">
              Try a partial name or check the suggestions below.
            </p>
          </div>
        )}

        {/* Top microbes (when no search) */}
        {!searchTerm.trim() && (
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
              Most studied microbes in the database
            </div>
            {loadingTop ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-5 bg-[var(--cream-dark)] rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-[var(--cream-dark)] rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {topMicrobes.map((m, i) => (
                  <button
                    key={m.bacterial_species}
                    onClick={() => setSearchTerm(m.bacterial_species)}
                    className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-5 card-hover text-left"
                    style={{
                      animation: `fadeUp 0.4s ease-out ${i * 0.05}s backwards`,
                    }}
                  >
                    <div className="font-serif italic text-lg mb-1">
                      {m.bacterial_species}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)]">
                      {m.paper_count} {m.paper_count === 1 ? "paper" : "papers"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function MicrobeRow({
  record,
  index,
}: {
  record: TaxonRecord;
  index: number;
}) {
  return (
    <Link href={`/papers/${record.paper_id}`}>
      <div
        className="bg-[var(--cream-light)] border border-[var(--line)] rounded-xl p-5 card-hover cursor-pointer"
        style={{
          animation: `fadeUp 0.3s ease-out ${Math.min(index * 0.03, 0.4)}s backwards`,
        }}
      >
        <div className="flex flex-wrap items-baseline gap-3 mb-1">
          <span className="font-serif italic text-lg">
            {record.bacterial_species}
          </span>
          {record.level && (
            <span className="text-xs uppercase tracking-wider text-[var(--ink-muted)]">
              {record.level}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ink-soft)]">
          {record.relative_abundance &&
            record.relative_abundance !== "Not reported" && (
              <span>
                Abundance:{" "}
                <span className="text-[var(--ink)]">
                  {record.relative_abundance}
                </span>
              </span>
            )}
          {record.condition_compared && (
            <span>
              Condition:{" "}
              <span className="text-[var(--ink)]">{record.condition_compared}</span>
            </span>
          )}
          <span className="text-[var(--ink-muted)] ml-auto">
            Paper #{record.paper_id} →
          </span>
        </div>
      </div>
    </Link>
  );
}