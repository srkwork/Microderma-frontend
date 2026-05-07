"use client";

import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { getRecommendations } from "@/lib/api";
import type { RecommendationResponse } from "@/lib/types";

const CONDITIONS = [
  { value: "acne", label: "Acne" },
  { value: "eczema", label: "Eczema / Atopic Dermatitis" },
  { value: "psoriasis", label: "Psoriasis" },
  { value: "rosacea", label: "Rosacea" },
  { value: "dandruff", label: "Dandruff / Seborrheic Dermatitis" },
  { value: "alopecia", label: "Alopecia" },
  { value: "wound_healing", label: "Wound Healing" },
  { value: "sensitive_skin", label: "Sensitive Skin" },
];

const BODY_SITES = [
  { value: "", label: "Any body site" },
  { value: "face", label: "Face" },
  { value: "scalp", label: "Scalp" },
  { value: "back", label: "Back" },
  { value: "arms", label: "Arms / Hands" },
  { value: "legs", label: "Legs / Feet" },
];

export default function RecommendationsPage() {
  const [condition, setCondition] = useState("acne");
  const [bodySite, setBodySite] = useState("");
  const [results, setResults] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);

  async function run() {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const data = await getRecommendations({
        skin_condition: condition,
        body_site: bodySite || undefined,
      });
      setResults(data);
      setHasRun(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not reach the recommendation engine. ${err.message}`
          : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
            Live recommendation engine
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-5 tracking-tight leading-[1.05]">
            Tell us your concern.
            <br />
            <em className="italic text-[var(--accent)]">We&apos;ll match the science.</em>
          </h1>
          <p className="text-lg text-[var(--ink-soft)] leading-relaxed mb-10 max-w-xl">
            Our engine queries the live database of peer-reviewed microbiome
            studies, filters to the last decade of research, and returns
            evidence-ranked microbes associated with your condition.
          </p>
        </Reveal>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 pb-8">
        <Reveal delay={150}>
          <div className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-7">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-2 block">
                  Skin concern
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-white border border-[var(--line)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--ink)] transition-colors"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-2 block">
                  Body site (optional)
                </label>
                <select
                  value={bodySite}
                  onChange={(e) => setBodySite(e.target.value)}
                  className="w-full bg-white border border-[var(--line)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--ink)] transition-colors"
                >
                  {BODY_SITES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={run}
              disabled={loading}
              className="btn-primary w-full px-6 py-3.5 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Querying database..." : "Get recommendations"}
            </button>
          </div>
        </Reveal>
      </section>

      {/* Results */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        {error && (
          <div className="text-sm text-[var(--ink)] bg-[var(--cream-dark)] border border-[var(--line)] rounded-lg p-4 mb-4">
            <strong className="font-medium">Connection error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4 flex justify-between">
              <span>Results · ranked by evidence</span>
              <span>
                {results.length}{" "}
                {results.length === 1 ? "recommendation" : "recommendations"}
              </span>
            </div>
            {results.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
        )}

        {hasRun && results.length === 0 && !loading && !error && (
          <div className="text-center py-16 text-[var(--ink-muted)]">
            <p className="font-serif text-2xl italic mb-3">
              No matches found.
            </p>
            <p className="text-sm">
              Try a different condition or remove the body site filter.
            </p>
          </div>
        )}

        {!hasRun && !loading && (
          <div className="text-center py-12 text-[var(--ink-muted)] italic">
            Pick a condition above and we&apos;ll query the live database.
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function RecommendationCard({
  rec,
  index,
}: {
  rec: RecommendationResponse;
  index: number;
}) {
  return (
    <div
      className="border border-[var(--line)] rounded-2xl p-6 bg-[var(--cream-light)] card-hover"
      style={{
        animation: `fadeUp 0.5s ease-out ${index * 0.1}s backwards`,
      }}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <h3 className="font-serif italic text-2xl leading-tight">
          {rec.relevant_microbes.join(", ")}
        </h3>
        <ConfidenceBadge level={rec.confidence} />
      </div>
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">
        {rec.rational}
      </p>
      <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
        <span>
          Cited from {rec.supporting_paper_ids.length} paper
          {rec.supporting_paper_ids.length === 1 ? "" : "s"}:
        </span>
        {rec.supporting_paper_ids.map((id) => (
          <a
            key={id}
            href={`/papers/${id}`}
            className="px-2 py-0.5 bg-white border border-[var(--line)] rounded-md hover:border-[var(--ink)] transition-colors"
          >
            #{id}
          </a>
        ))}
      </div>
    </div>
  );
}

function ConfidenceBadge({ level }: { level: "low" | "medium" | "high" }) {
  const styles = {
    high: "bg-[var(--ink)] text-[var(--cream-light)]",
    medium: "bg-[var(--cream-dark)] text-[var(--ink)]",
    low: "bg-[var(--cream)] text-[var(--ink-soft)] border border-[var(--line)]",
  };
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium uppercase tracking-wider ${styles[level]}`}
    >
      {level} confidence
    </span>
  );
}