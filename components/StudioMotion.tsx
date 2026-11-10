"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
/** Progressive motion: server content stays visible, including without JS. */
export function StudioMotion() {
  const path = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      preference.matches ||
      !("IntersectionObserver" in window) ||
      typeof Element.prototype.animate !== "function"
    )
      return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            if (!preference.matches)
              animations.push(
                entry.target.animate(
                  [
                    { transform: "translateY(16px)" },
                    { transform: "translateY(0)" },
                  ],
                  { duration: 460, easing: "cubic-bezier(.2,.7,.2,1)" },
                ),
              );
          }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        "main [data-reveal], main .section-head, main .team-card",
      )
      .forEach((element) => observer.observe(element));
    const cancel = () => {
      if (preference.matches) {
        observer.disconnect();
        animations.forEach((a) => a.cancel());
      }
    };
    preference.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      preference.removeEventListener("change", cancel);
    };
  }, [path]);
  return null;
}
