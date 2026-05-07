import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="font-serif text-9xl text-[var(--accent)] mb-4">404</div>
        <h1 className="font-serif text-3xl mb-4">
          That page doesn&apos;t exist.
        </h1>
        <p className="text-[var(--ink-soft)] mb-8">
          The page you&apos;re looking for isn&apos;t in our research database.
        </p>
        <Link
          href="/"
          className="btn-primary px-6 py-3 rounded-full text-sm font-medium inline-block"
        >
          ← Back home
        </Link>
      </div>
    </SiteShell>
  );
}