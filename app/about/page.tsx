import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
            About
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-8 tracking-tight leading-[1.05]">
            Why we built <em className="italic text-[var(--accent)]">Cosnetix</em>
          </h1>
        </Reveal>
      </section>

      <article className="max-w-3xl mx-auto px-6 pb-12 space-y-10">
        <Reveal delay={100}>
          <Block title="The problem">
            <p>
              Skincare is a $200 billion industry built mostly on guesswork.
              Most products are chosen based on marketing, influencer
              endorsements, or trial and error — not on what science actually
              says about your individual biology.
            </p>
            <p>
              Skin conditions like acne, eczema, and rosacea are increasingly
              understood as the result of microbiome imbalance. But the
              research connecting specific microbes to specific conditions is
              scattered across thousands of journal articles, written for
              experts, locked behind paywalls.
            </p>
          </Block>
        </Reveal>

        <Reveal delay={150}>
          <Block title="Our approach">
            <p>
              We built a normalized SQL evidence database that distills 100+
              peer-reviewed microbiome studies into a queryable format. Every
              row links a microbe to its abundance shift, the skin condition
              it&apos;s associated with, the body site, the population studied,
              the methodology, the statistics, and a quality score.
            </p>
            <p>
              On top of that database, we&apos;re building a recommendation
              engine that maps an individual&apos;s microbiome profile against
              the evidence to compute weighted feature scores: acne propensity,
              inflammation risk, barrier disruption, sebum imbalance, and
              diversity index. Those scores feed into a ranking model that
              matches products by ingredient composition.
            </p>
          </Block>
        </Reveal>

        <Reveal delay={200}>
          <Block title="The pipeline">
            <ol className="space-y-4 list-none">
              <PipelineStep
                num="01"
                title="Evidence extraction"
                body="Peer-reviewed papers are extracted into normalized rows linking taxa, abundance, conditions, methods, and quality scores."
              />
              <PipelineStep
                num="02"
                title="Profile mapping"
                body="A user's measured microbiome is mapped onto the evidence to compute weighted feature scores across five axes."
              />
              <PipelineStep
                num="03"
                title="Ranked recommendations"
                body="Products are scored by matching ingredient and formulation features against the predicted skin state."
              />
            </ol>
          </Block>
        </Reveal>

        <Reveal delay={250}>
          <Block title="Tech stack">
            <p>
              The backend is a Python FastAPI service with Pydantic validation
              and a PostgreSQL database holding 8 normalized tables. The
              frontend is Next.js with TypeScript and Tailwind CSS. Both are
              fully open-source and reproducible.
            </p>
            <p>
              All recommendations cite the studies they&apos;re drawn from. No
              vague claims, no proprietary black boxes.
            </p>
          </Block>
        </Reveal>

        <Reveal delay={300}>
          <Block title="The team">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "Saaketh Katikareddy", role: "Backend & infrastructure" },
                { name: "Artin Seyrafi", role: "Extraction pipeline" },
                { name: "Hamza Rafeeq", role: "Research & validation" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="bg-[var(--cream)] border border-[var(--line)] rounded-xl p-5"
                >
                  <div className="font-serif text-lg mb-1">{p.name}</div>
                  <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                    {p.role}
                  </div>
                </div>
              ))}
            </div>
          </Block>
        </Reveal>

        <Reveal delay={350}>
          <div className="text-center py-8 border-t border-[var(--line)]">
            <p className="font-serif italic text-2xl mb-6 text-[var(--ink-soft)]">
              Published science <span className="text-[var(--accent)]">{">>>"}</span> marketing.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/recommendations"
                className="btn-primary px-6 py-3 rounded-full text-sm font-medium"
              >
                Try the demo
              </Link>
              <Link
                href="/papers"
                className="btn-secondary px-6 py-3 rounded-full text-sm font-medium"
              >
                Browse research
              </Link>
            </div>
          </div>
        </Reveal>
      </article>
    </SiteShell>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl mb-5">{title}</h2>
      <div className="space-y-4 text-[var(--ink-soft)] leading-relaxed text-base">
        {children}
      </div>
    </div>
  );
}

function PipelineStep({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-5 items-start">
      <span className="font-serif text-2xl text-[var(--accent)] flex-shrink-0 w-12">
        {num}
      </span>
      <div>
        <div className="font-serif text-xl mb-1 text-[var(--ink)]">{title}</div>
        <div className="text-sm text-[var(--ink-soft)] leading-relaxed">
          {body}
        </div>
      </div>
    </li>
  );
}