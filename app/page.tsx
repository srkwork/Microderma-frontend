"use client";

import {useState, useEffect, useRef} from "react";
import Link from "next/link";

const API_BASE = "http://localhost:8000";

interface Recommendation {
  rationale: string;
  relevant_microbes: string[],
  supporting_paper_ids: number[],
  confidence: "low" | "medium" | "high";
}

// Subtle decorative wavy line — matches the brand identity
function WavyLine({
  className = "",
  flip = false,

}: {
  className?: string;
  flip?: boolean;
}) {
   return(
    <svg
      className={className}
      width="120"
      height="400"
      viewBox="0 0 120 400"
      fill="none"
      style={{transform: flip ? "scaleX(-1)" : "none"}}
      aria-hidden="true"
    >
      <path
        d="M60 0 C 30 80, 90 160, 60 240 C 30 320, 90 360, 60 400"
        stroke="#2A2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
   )
}

// Hook for scroll-triggered animations
// Module-level cache: survives any remount within the same tab session.
// Empty on server-side render and on initial client render (so no hydration mismatch),
// then populated as animations complete.
let homeAnimated = false;
const playedCounts = new Set<string>();

function useInView(threshold = 0.15){
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if(homeAnimated){
      setInView(true);
      return;
    }
    if(!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting) {
          homeAnimated = true;
          setInView(true);
          observer.disconnect();
        }
      },
      {threshold}
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return {ref, inView};
}

// Animated counter for stats
function CountUp({end, suffix=""}: {end: number; suffix?: string}){
  const countKey = `${end}:${suffix}`;
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if(playedCounts.has(countKey)){
      setCount(end);
      return;
    }
    if(!ref.current) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const observer = new IntersectionObserver(([entry]) => {
      if(!entry.isIntersecting || timer) return;
      observer.disconnect();
      const duration = 1400;
      const steps = 40;
      const increment = end / steps;
      let current = 0;
      timer = setInterval(() => {
        current += increment;
        if(current > end){
          setCount(end);
          playedCounts.add(countKey);
          if(timer) clearInterval(timer);
        }
        else{
          setCount(Math.floor(current));
        }
      }, duration/steps);
    }, {threshold: 0.15});
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if(timer) clearInterval(timer);
    };
  }, [end, countKey]);

  return(
    <span ref={ref} className="number-display">
      {count}
      {suffix}
    </span>
  )
}


export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [condition, setCondition] = useState("acne");
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runDemo() {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`${API_BASE}/recommendations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skin_condition: condition }),
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the backend. Is it running on port 8000?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative wavy lines on the edges (brand identity) */}
      <WavyLine className="absolute top-0 left-0 hidden lg:block" />
      <WavyLine
        className="absolute top-0 right-0 hidden lg:block"
        flip
      />

      {/* Top navigation */}
      <nav className="relative z-10 border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2.5 animate-fade-in">
            <div className="w-9 h-9 bg-[var(--cream-light)] border border-[var(--line)] rounded-lg flex items-center justify-center relative">
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
          </div>
          <div className="hidden md:flex gap-8 text-sm text-[var(--ink-soft)]">
            <Link
              href="/papers"
              className="hover:text-[var(--ink)] transition-colors"
            >
              Research
            </Link>
            <Link
              href="/microbes"
              className="hover:text-[var(--ink)] transition-colors"
            >
              Microbes
            </Link>
            <Link
              href="/recommendations"
              className="hover:text-[var(--ink)] transition-colors"
            >
              Recommendations
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--ink)] transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div
          className="inline-block px-3 py-1 bg-[var(--cream-light)] border border-[var(--line)] text-[var(--ink-soft)] text-xs tracking-wide rounded-full mb-8 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          Research preview · 100+ peer-reviewed studies
        </div>

        <h1
          className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Skincare grounded in <em className="italic">your</em> biology
        </h1>

        <p
          className="text-lg md:text-xl text-[var(--ink-soft)] leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          The first cosmetic analysis tool personalized to your skin
          microbiome. Real research, not marketing claims.
        </p>

        <div
          className="flex flex-wrap gap-3 justify-center animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={() => setDemoOpen(!demoOpen)}
            className="btn-primary px-7 py-3.5 rounded-full text-sm font-medium"
          >
            {demoOpen ? "Close demo ↑" : "Try the live demo →"}
          </button>
          <Link
            href="/papers"
            className="btn-secondary px-7 py-3.5 rounded-full text-sm font-medium"
          >
            Browse research
          </Link>
        </div>
      </section>

      {/* Inline demo (smooth expand) */}
      {demoOpen && (
        <section className="relative z-10 max-w-3xl mx-auto px-6 pb-12 animate-expand">
          <div className="bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-7">
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
              Live recommendation engine
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="flex-1 bg-white border border-[var(--line)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--ink)] transition-colors"
              >
                <option value="acne">Acne</option>
                <option value="eczema">Eczema</option>
                <option value="psoriasis">Psoriasis</option>
                <option value="rosacea">Rosacea</option>
                <option value="dandruff">Dandruff</option>
              </select>
              <button
                onClick={runDemo}
                disabled={loading}
                className="btn-primary px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50 min-w-[180px]"
              >
                {loading ? "Analyzing..." : "Get recommendations"}
              </button>
            </div>

            {error && (
              <div className="text-sm text-[var(--ink)] bg-[var(--cream-dark)] border border-[var(--line)] rounded-lg p-4 mb-4 animate-fade-in">
                <strong className="font-medium">Connection error:</strong>{" "}
                {error}
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                {results.map((rec, i) => (
                  <div
                    key={i}
                    className="border border-[var(--line)] rounded-lg p-5 bg-white animate-fade-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div className="font-medium italic font-serif text-lg">
                        {rec.relevant_microbes.join(", ")}
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium uppercase tracking-wider animate-pop ${
                          rec.confidence === "high"
                            ? "bg-[var(--ink)] text-[var(--cream-light)]"
                            : rec.confidence === "medium"
                            ? "bg-[var(--cream-dark)] text-[var(--ink)]"
                            : "bg-[var(--cream)] text-[var(--ink-soft)]"
                        }`}
                      >
                        {rec.confidence}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-2">
                      {rec.rationale}
                    </p>
                    <p className="text-xs text-[var(--ink-muted)]">
                      Cited from {rec.supporting_paper_ids.length} paper
                      {rec.supporting_paper_ids.length === 1 ? "" : "s"} · #
                      {rec.supporting_paper_ids.join(", #")}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && !error && (
              <div className="text-sm text-[var(--ink-muted)] text-center py-10 italic">
                Pick a condition above and we&apos;ll query the live database.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats bar */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <div className="bg-[var(--cream)] p-8 text-center">
            <div className="font-serif text-4xl md:text-5xl mb-2">
              <CountUp end={104} suffix="+" />
            </div>
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
              Research papers
            </div>
          </div>
          <div className="bg-[var(--cream)] p-8 text-center">
            <div className="font-serif text-4xl md:text-5xl mb-2">
              <CountUp end={696} />
            </div>
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
              Microbial taxa
            </div>
          </div>
          <div className="bg-[var(--cream)] p-8 text-center">
            <div className="font-serif text-4xl md:text-5xl mb-2">
              <CountUp end={2500} suffix="+" />
            </div>
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
              Validated samples
            </div>
          </div>
        </div>
      </section>

      {/* The pipeline (matches your presentation) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-[var(--line)]">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
              How it works
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">
              A three-stage pipeline
            </h2>
            <p className="text-[var(--ink-soft)] max-w-xl mx-auto">
              Each step bridges the gap between published research and what
              actually goes on your skin.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Evidence extraction",
              body: "We extract structured data from peer-reviewed microbiome studies. Each row links taxa, abundance shifts, skin conditions, body sites, populations, and quality scores.",
            },
            {
              num: "02",
              title: "Profile mapping",
              body: "Your microbiome data is mapped onto the evidence table to compute weighted feature scores across acne, inflammation, barrier disruption, sebum imbalance, and diversity.",
            },
            {
              num: "03",
              title: "Ranked recommendations",
              body: "Products are scored by matching ingredient and formulation features against your predicted skin state. Each recommendation cites the studies behind it.",
            },
          ].map((step, i) => (
            <RevealOnScroll key={step.num} delay={i * 100}>
              <div className="card-hover bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-7 h-full">
                <div className="font-serif text-3xl text-[var(--accent)] mb-4">
                  {step.num}
                </div>
                <h3 className="font-serif text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                  {step.body}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* What makes it different */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-[var(--line)]">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-4">
              Why Cosnetix
            </div>
            <h2 className="font-serif text-4xl md:text-5xl">
              Published science{" "}
              <span className="italic text-[var(--accent)]">{">>>"}</span>{" "}
              marketing
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              title: "Evidence-cited",
              body: "Every recommendation references the studies it's drawn from. No vague claims, no influencer endorsements.",
            },
            {
              title: "Recency-weighted",
              body: "Studies older than 10 years are filtered out by default. Microbiome science moves fast — we track the frontier.",
            },
            {
              title: "Transparent confidence",
              body: "Each recommendation includes a confidence rating based on how many independent papers support it.",
            },
            {
              title: "Open methodology",
              body: "Our schema, ingestion pipeline, and ranking logic are documented and reproducible end-to-end.",
            },
          ].map((feat, i) => (
            <RevealOnScroll key={feat.title} delay={i * 80}>
              <div className="card-hover bg-[var(--cream-light)] border border-[var(--line)] rounded-2xl p-7 h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1 h-6 bg-[var(--accent)] rounded-full mt-1" />
                  <h3 className="font-serif text-xl">{feat.title}</h3>
                </div>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed pl-4">
                  {feat.body}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center border-t border-[var(--line)]">
        <RevealOnScroll>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Ready to see what your skin is telling you?
          </h2>
          <p className="text-[var(--ink-soft)] mb-8 max-w-xl mx-auto">
            Run the live demo, browse the research database, or read about how
            we built this.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setDemoOpen(true);
                setTimeout(() => {
                  document
                    .querySelector(".animate-expand")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              }}
              className="btn-primary px-7 py-3.5 rounded-full text-sm font-medium"
            >
              Try the demo
            </button>
            <Link
              href="/papers"
              className="btn-secondary px-7 py-3.5 rounded-full text-sm font-medium"
            >
              See the research
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--line)] mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div>
              <div className="font-serif text-xl mb-2">Cosnetix</div>
              <p className="text-sm text-[var(--ink-muted)] max-w-sm">
                Personalized skincare, grounded in your biology.
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-3">
                  Product
                </div>
                <div className="space-y-2">
                  <Link
                    href="/papers"
                    className="block hover:text-[var(--accent)] transition-colors"
                  >
                    Research
                  </Link>
                  <Link
                    href="/microbes"
                    className="block hover:text-[var(--accent)] transition-colors"
                  >
                    Microbes
                  </Link>
                  <Link
                    href="/recommendations"
                    className="block hover:text-[var(--accent)] transition-colors"
                  >
                    Recommendations
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-3">
                  Company
                </div>
                <div className="space-y-2">
                  <Link
                    href="/about"
                    className="block hover:text-[var(--accent)] transition-colors"
                  >
                    About
                  </Link>
                  <a
                    href="https://www.cosnetix.com"
                    target="_blank"
                    rel="noopener"
                    className="block hover:text-[var(--accent)] transition-colors"
                  >
                    Main site ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between gap-3 text-xs text-[var(--ink-muted)]">
            <div>
              Research preview · Not medical advice · By Saaketh Katikareddy,
              Artin Seyrafi, Hamza Rafeeq
            </div>
            <div>© 2026 Cosnetix</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable scroll-triggered reveal wrapper
function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}