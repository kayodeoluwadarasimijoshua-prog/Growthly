"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { trackEvent, type GrowthlyAnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  eventName: GrowthlyAnalyticsEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  ariaLabel?: string;
};

export function TrackedLink({
  eventName,
  eventParams,
  onClick,
  children,
  ariaLabel,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      aria-label={ariaLabel}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  eventName: GrowthlyAnalyticsEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

export function TrackedAnchor({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
