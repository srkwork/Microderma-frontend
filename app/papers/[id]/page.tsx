"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { getPaper } from "@/lib/api";
import type { PaperDetail } from "@/lib/types";


export default function PaperDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = rawId ? parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10) : NaN;

  const [paper, setPaper] = useState<PaperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[PaperDetail] params:", params, "parsed id:", id);

    if (isNaN(id)) {
      setError(`Invalid paper ID: got ${rawId}`);
      setLoading(false);
      return;
    }

    console.log(`[PaperDetail] fetching paper ${id}`);

    getPaper(id)
        .then((data) => {
            console.log("[PaperDetail] got data:", data);
            setPaper(data);
        })
        .catch((err) => {
            console.error("[PaperDetail] fetch failed:", err);
            setError(err instanceof Error ? err.message : "Could not load paper");
        })
        .finally(() => setLoading(false));
  }, [id, rawId]);

  if (loading) {
    return (
      <SiteShell>
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
          <div className="animate-pulse">
            <div className="h-4 bg-[var(--cream-dark)] rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-[var(--cream-dark)] rounded w-3/4 mb-3"></div>
            <div className="h-12 bg-[var(--cream-dark)] rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </SiteShell>
    );
  }

  if (error || !paper) {
    return (
      <SiteShell>
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
          <p className="font-serif text-3xl italic mb-3">Paper not found.</p>
          <p className="text-[var(--ink-soft)] mb-6">{error}</p>
          <Link href="/papers" className="btn-primary px-6 py-3 rounded-full text-sm inline-block">
            ← Back to all papers
          </Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <Reveal>
          <Link
            href="/papers"
            className="text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors mb-6 inline-block"
          >
            ← All papers
          </Link>
          <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-3">
            Paper #{paper.paper_id}
            {paper.publication_year && ` · ${paper.publication_year}`}
            {paper.journal && ` · ${paper.journal}`}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight leading-tight">
            {paper.title}
          </h1>
          {paper.authors && (
            <p className="text-base text-[var(--ink-soft)] mb-2">
              {paper.authors}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-4 text-xs">
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener"
                className="px-3 py-1.5 bg-[var(--cream-light)] border border-[var(--line)] rounded-full hover:border-[var(--ink)] transition-colors"
              >
                DOI: {paper.doi} ↗
              </a>
            )}
            {paper.pmid && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}`}
                target="_blank"
                rel="noopener"
                className="px-3 py-1.5 bg-[var(--cream-light)] border border-[var(--line)] rounded-full hover:border-[var(--ink)] transition-colors"
              >
                PubMed: {paper.pmid} ↗
              </a>
            )}
            {paper.extraction_source && (
              <span className="px-3 py-1.5 bg-[var(--cream-light)] border border-[var(--line)] rounded-full">
                Source: {paper.extraction_source}
              </span>
            )}
          </div>
        </Reveal>
      </section>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-5">
        {paper.findings && paper.findings.length > 0 && (
          <Section title="Findings">
            {paper.findings.map((f, i) => (
              <div key={i} className="space-y-3">
                {f.primary_findings && (
                  <Field label="Primary findings" value={f.primary_findings} />
                )}
                {f.reported_associations && (
                  <Field
                    label="Reported associations"
                    value={f.reported_associations}
                  />
                )}
                {f.statistical_tests && (
                  <Field label="Statistical tests" value={f.statistical_tests} />
                )}
                {f.p_values_fdr && (
                  <Field label="P-values / FDR" value={f.p_values_fdr} />
                )}
              </div>
            ))}
          </Section>
        )}

        {paper.microbiome_data && paper.microbiome_data.length > 0 && (
          <Section
            title="Microbiome data"
            subtitle={`${paper.microbiome_data.length} taxa reported`}
          >
            <div className="space-y-2">
              {paper.microbiome_data.map((t, i) => (
                <div
                  key={`${t.taxa_id}-${i}`}
                  className="flex flex-wrap items-baseline gap-x-3 py-2 border-b border-[var(--line)] last:border-0"
                >
                  <span className="font-serif italic text-base">
                    {t.bacterial_species}
                  </span>
                  {t.level && (
                    <span className="text-xs uppercase tracking-wider text-[var(--ink-muted)]">
                      {t.level}
                    </span>
                  )}
                  {t.relative_abundance && (
                    <span className="text-sm text-[var(--ink-soft)] ml-auto">
                      {t.relative_abundance}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {paper.demographics && paper.demographics.length > 0 && (
          <Section title="Population">
            {paper.demographics.map((d, i) => (
              <div key={i} className="space-y-3">
                {d.health_condition_bucket && (
                  <Field
                    label="Condition"
                    value={d.health_condition_bucket}
                  />
                )}
                {d.sample_size && (
                  <Field label="Sample size" value={String(d.sample_size)} />
                )}
                {d.age_range && <Field label="Age" value={d.age_range} />}
                {d.sex_distribution && (
                  <Field label="Sex distribution" value={d.sex_distribution} />
                )}
                {d.geographic_region && (
                  <Field label="Region" value={d.geographic_region} />
                )}
                {d.ethnicity_race && (
                  <Field label="Ethnicity / race" value={d.ethnicity_race} />
                )}
              </div>
            ))}
          </Section>
        )}

        {paper.study_design && paper.study_design.length > 0 && (
          <Section title="Methodology">
            {paper.study_design.map((sd, i) => (
              <div key={i} className="space-y-3">
                {sd.study_type && (
                  <Field label="Study type" value={sd.study_type} />
                )}
                {sd.skin_site_sampled && (
                  <Field label="Body site" value={sd.skin_site_sampled} />
                )}
                {sd.sampling_method && (
                  <Field label="Sampling method" value={sd.sampling_method} />
                )}
                {sd.sequencing_method && (
                  <Field
                    label="Sequencing method"
                    value={sd.sequencing_method}
                  />
                )}
                {((sd as any).sequencing_platform as string | undefined) && (
                  <Field
                    label="Sequencing platform"
                    value={(sd as any).sequencing_platform}
                  />
                )}
              </div>
            ))}
          </Section>
        )}

        {paper.quality_assessment && paper.quality_assessment.length > 0 && (
          <Section title="Quality assessment">
            {paper.quality_assessment.map((qa, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                {qa.overall_quality_rating && (
                  <Field
                    label="Overall rating"
                    value={qa.overall_quality_rating}
                  />
                )}
                {qa.peer_review_status && (
                  <Field
                    label="Peer reviewed"
                    value={qa.peer_review_status}
                  />
                )}
                {qa.controls_present && (
                  <Field label="Controls present" value={qa.controls_present} />
                )}
                {qa.statistical_rigor && (
                  <Field
                    label="Statistical rigor"
                    value={qa.statistical_rigor}
                  />
                )}
              </div>
            ))}
          </Section>
        )}
      </div>
    </SiteShell>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-7">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl">{title}</h2>
          {subtitle && (
            <span className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
              {subtitle}
            </span>
          )}
        </div>
        {children}
      </div>
    </Reveal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-1">
        {label}
      </div>
      <div className="text-sm text-[var(--ink)] leading-relaxed">{value}</div>
    </div>
  );
}