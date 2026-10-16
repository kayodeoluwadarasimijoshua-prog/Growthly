import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export function BreadcrumbTrail({
  items,
  schema = true,
}: {
  items: { name: string; path: string }[];
  schema?: boolean;
}) {
  return (
    <>
      {schema && <BreadcrumbSchema items={items} />}
      <nav className="breadcrumb-trail" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          {items.map((item, index) => (
            <li key={item.path}>
              <span aria-hidden="true">/</span>
              {index === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function PageIntro({
  label,
  path,
  eyebrow,
  title,
  description,
  aside,
  children,
}: {
  label: string;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero page-hero--green">
      <div className="container">
        <BreadcrumbTrail items={[{ name: label, path }]} />
        <div className={aside ? "page-hero__grid" : "page-intro__copy"}>
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
            {children}
          </div>
          {aside && <aside className="page-hero__aside">{aside}</aside>}
        </div>
      </div>
    </section>
  );
}
