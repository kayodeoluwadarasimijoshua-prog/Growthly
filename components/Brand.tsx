import Link from "next/link";
import { GrowthlyMark } from "@/components/GrowthlyMark";
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      className={`brand-link${footer ? " footer-brand-link" : ""}`}
      href="/"
      aria-label="GROWTHLY home"
    >
      <GrowthlyMark
        className="brand-mark"
        light={footer}
        id={footer ? "footer" : "header"}
      />
      <span className="brand-wordmark">GROWTHLY</span>
    </Link>
  );
}
