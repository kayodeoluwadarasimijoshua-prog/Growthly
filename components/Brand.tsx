import Link from "next/link";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      className={`brand-link${footer ? " footer-brand-link" : ""}`}
      href="/"
      aria-label="GROWTHLY home"
    >
      <svg
        className="brand-mark"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="12"
          fill="currentColor"
          opacity=".12"
        />
        <path
          d="M10 25.6c4.1-.1 7.1-2.6 8.2-7.5 4.9.5 8.8-1.7 11.5-6.4 1.1 6.7-.9 13.4-6 17.1-4.1 3-9.4 2.7-13.7-1.4Z"
          fill="currentColor"
        />
        <path
          d="M11 29c4.5-4.3 8.9-8 15.5-13"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="brand-wordmark">GROWTHLY</span>
    </Link>
  );
}
