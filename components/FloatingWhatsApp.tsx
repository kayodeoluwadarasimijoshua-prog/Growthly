"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { usePathname } from "next/navigation";
import { usePublicSettings } from "@/components/PublicSiteSettings";
import { getWhatsAppUrl } from "@/lib/site";
import {
  getServicePageForPath,
  getServicePage,
  serviceContactMessage,
  type ServicePage,
} from "@/config/service-pages";
import { trackEvent } from "@/lib/analytics";
import {
  clampContactPosition,
  readContactPosition,
  CONTACT_POSITION_KEY,
  CONTACT_SIZE,
  type ContactPosition,
} from "@/lib/floating-contact";

type Drag = {
  pointerId: number;
  startX: number;
  startY: number;
  origin: ContactPosition;
  moved: boolean;
};

function withinScreen(position: ContactPosition) {
  const consent = document
    .querySelector(".consent-banner")
    ?.getBoundingClientRect();
  return clampContactPosition(
    position,
    window.innerWidth,
    window.innerHeight,
    consent?.top,
  );
}

function remember(position: ContactPosition) {
  try {
    window.localStorage.setItem(CONTACT_POSITION_KEY, JSON.stringify(position));
  } catch {
    /* Movement still works when storage is unavailable. */
  }
}

export function FloatingWhatsApp({
  contextualService,
  pageScoped = false,
}: {
  contextualService?: ServicePage;
  pageScoped?: boolean;
}) {
  const { settings, available, projectServices } = usePublicSettings();
  const pathname = usePathname();
  const servicePage =
    contextualService ??
    getServicePageForPath(pathname) ??
    getServicePage(projectServices[pathname]);
  const contactMessage =
    servicePage || ["/contact", "/request-a-quote"].includes(pathname)
      ? serviceContactMessage(servicePage)
      : undefined;
  const [position, setPosition] = useState<ContactPosition | null>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [moving, setMoving] = useState(false);
  const current = useRef<ContactPosition | null>(null);
  const customPosition = useRef(false);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const hidden =
    !available ||
    pathname.startsWith("/admin") ||
    (!pageScoped && ["/contact", "/request-a-quote"].includes(pathname));

  function move(next: ContactPosition) {
    const safe = withinScreen(next);
    current.current = safe;
    setPosition((old) => (old?.x === safe.x && old?.y === safe.y ? old : safe));
    return safe;
  }

  useEffect(() => {
    if (hidden) return;
    setMotionReady(true);
    try {
      const stored = readContactPosition(
        window.localStorage.getItem(CONTACT_POSITION_KEY),
      );
      if (stored) {
        current.current = stored;
        customPosition.current = true;
      }
    } catch {
      /* Use default position. */
    }
    function fit() {
      move(
        customPosition.current && current.current
          ? current.current
          : {
              x: window.innerWidth - CONTACT_SIZE - 20,
              y: window.innerHeight - CONTACT_SIZE - 20,
            },
      );
    }
    fit();
    window.addEventListener("resize", fit);
    // Keep the button above the analytics consent banner when it appears/disappears.
    const observer = new MutationObserver(fit);
    // The consent banner is a direct body child. Do not force layout for every
    // mutation inside large marketing pages, forms or project-image fallbacks.
    observer.observe(document.body, { childList: true });
    return () => {
      window.removeEventListener("resize", fit);
      observer.disconnect();
    };
  }, [hidden]);

  function begin(event: PointerEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    const box = event.currentTarget.getBoundingClientRect();
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: { x: box.left, y: box.top },
      moved: false,
    };
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function reposition(event: PointerEvent<HTMLAnchorElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    if (!active.moved && Math.hypot(dx, dy) < 6) return;
    active.moved = true;
    suppressClick.current = true;
    customPosition.current = true;
    setMoving(true);
    move({ x: active.origin.x + dx, y: active.origin.y + dy });
  }

  function finish(event: PointerEvent<HTMLAnchorElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (active.moved && current.current) remember(current.current);
    drag.current = null;
    setMoving(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyboard(event: KeyboardEvent<HTMLAnchorElement>) {
    const directions: Record<string, ContactPosition> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    };
    if (event.key !== "Home" && !directions[event.key]) return;
    event.preventDefault();
    const origin = current.current ?? {
      x: window.innerWidth - CONTACT_SIZE - 20,
      y: window.innerHeight - CONTACT_SIZE - 20,
    };
    const step = event.shiftKey ? 40 : 16;
    const direction = directions[event.key];
    const next =
      event.key === "Home"
        ? {
            x: window.innerWidth - CONTACT_SIZE - 20,
            y: window.innerHeight - CONTACT_SIZE - 20,
          }
        : {
            x: origin.x + direction.x * step,
            y: origin.y + direction.y * step,
          };
    customPosition.current = event.key !== "Home";
    suppressClick.current = false;
    remember(move(next));
  }

  if (hidden) return null;
  return (
    <aside aria-label="WhatsApp contact">
      <a
        className={`floating-whatsapp${moving ? " floating-whatsapp--moving" : ""}${motionReady ? " floating-whatsapp--motion-ready" : ""}`}
        style={
          position
            ? {
                left: position.x,
                top: position.y,
                right: "auto",
                bottom: "auto",
              }
            : undefined
        }
        href={getWhatsAppUrl(contactMessage, settings.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Growthly on WhatsApp"
        aria-describedby="floating-whatsapp-help"
        title="WhatsApp — drag to move; arrow keys move; Home resets"
        draggable={false}
        onPointerDown={begin}
        onPointerMove={reposition}
        onPointerUp={finish}
        onPointerCancel={finish}
        onLostPointerCapture={() => {
          drag.current = null;
          setMoving(false);
        }}
        onKeyDown={keyboard}
        onClick={(event) => {
          if (suppressClick.current && event.detail !== 0) {
            event.preventDefault();
            suppressClick.current = false;
            return;
          }
          trackEvent("whatsapp_click", { placement: "floating_contact" });
        }}
      >
        {/* WhatsApp brand mark: Simple Icons 16.35.0, CC0; no custom inner disc. */}
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
      <span id="floating-whatsapp-help" className="sr-only">
        Opens WhatsApp in a new tab; you must send the message there. Drag to
        move this button, or focus it and use the arrow keys. Press Home to
        reset its position.
      </span>
    </aside>
  );
}
