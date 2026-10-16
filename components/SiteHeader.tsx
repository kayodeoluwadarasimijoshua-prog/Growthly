"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePublicSettings } from "@/components/PublicSiteSettings";
import { business } from "@/config/business";
import {
  getServicePageForPath,
  getServicePage,
  getServiceQuoteHref,
  getServiceContactHref,
} from "@/config/service-pages";
import { Brand } from "@/components/Brand";
import { trackEvent } from "@/lib/analytics";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Website Development", href: "/website-development" },
  { label: "Services", href: "/services" },
  { label: "Website Pricing", href: "/pricing" },
  { label: "Our Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { projectServices } = usePublicSettings();
  const servicePage =
    getServicePageForPath(pathname) ??
    getServicePage(projectServices[pathname]);
  const quoteHref =
    pathname === "/request-a-quote"
      ? "#main-content"
      : pathname === "/contact"
        ? "#contact-options"
        : servicePage
          ? getServiceQuoteHref(servicePage.slug)
          : business.primaryCTA.href;
  const quoteLabel =
    pathname === "/request-a-quote"
      ? "Complete your brief"
      : pathname === "/contact"
        ? "Contact options"
        : (servicePage?.cta ?? business.primaryCTA.label);

  function isCurrent(href: string) {
    if (href === "/") return pathname === "/";
    if (
      href === "/services" &&
      servicePage?.slug !== "website-development" &&
      servicePage
    )
      return true;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
        }
      }}
    >
      <noscript>
        <style>{`
        @media (max-width:1160px) {
          .site-header .header-inner { flex-wrap:wrap; padding-block:16px; height:auto; }
          .site-header .primary-nav { display:flex; flex-direction:row; flex-wrap:wrap; position:static; order:3; flex-basis:100%; padding:8px 0 0; gap:8px 20px; background:transparent; box-shadow:none; border:0; }
          .site-header .primary-nav a { padding:8px 0; border:0; font-size:14px; }
          .site-header .primary-nav .mobile-nav-cta { display:inline-flex; padding:10px 16px; margin:0; }
          .site-header .menu-toggle { display:none; }
        }
      `}</style>
      </noscript>
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
              href={
                item.href === "/contact" && servicePage
                  ? getServiceContactHref(servicePage.slug)
                  : item.href === "/contact" && pathname === "/contact"
                    ? "#contact-options"
                    : item.href === "/contact" &&
                        pathname === "/request-a-quote"
                      ? "#quote-contact-options"
                      : item.href
              }
              key={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="mobile-nav-cta button button--primary button--small"
            href={quoteHref}
            onClick={() => {
              setOpen(false);
              trackEvent(
                "quote_cta_click",
                servicePage ? { service: servicePage.slug } : undefined,
              );
            }}
          >
            {quoteLabel} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </nav>
        <div className="header-actions">
          <Link
            className="button button--primary button--small"
            href={quoteHref}
            onClick={() =>
              trackEvent(
                "quote_cta_click",
                servicePage ? { service: servicePage.slug } : undefined,
              )
            }
          >
            {quoteLabel} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-controls="primary-navigation"
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
