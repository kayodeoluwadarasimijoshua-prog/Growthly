import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="not-found__code">404 · PAGE NOT FOUND</span>
      <h1>This page isn’t part of the journey.</h1>
      <p>
        The address may have changed, or the page may no longer be available.
        Let’s get you somewhere useful.
      </p>
      <div className="hero-actions">
        <Link className="button button--primary" href="/">
          <ArrowLeft size={16} aria-hidden="true" /> Back to home
        </Link>
        <Link className="button button--outline" href="/services">
          Explore services <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
