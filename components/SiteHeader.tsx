"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/Brand";
import { trackEvent } from "@/lib/analytics";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isCurrent(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav
          className="primary-nav"
          id="primary-navigation"
          aria-label="Main navigation"
          data-open={open}
        >
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="mobile-nav-cta button button--primary button--small"
            href="/start-project"
            onClick={() => {
              setOpen(false);
              trackEvent("service_cta_click");
            }}
          >
            Start a project <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </nav>
        <div className="header-actions">
          <Link className="button button--primary button--small" href="/start-project" onClick={() => trackEvent("service_cta_click")}>
            Start a project <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-controls="primary-navigation"
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
