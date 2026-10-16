"use client";
import Image from "next/image";
import REVIEW_IMAGE_WIDTHS from "@/config/review-image-widths.json";
import { useState } from "react";
import type { PortfolioProject } from "@/config/content";

/** Only registered local assets. Missing approval leaves the project text-only. */
export function ProjectPreview({
  project,
  priority = false,
}: {
  project: PortfolioProject;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!project.image) return null;
  const image = project.image;
  return (
    <div
      className="project-front-image"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      {failed ? (
        <div className="project-image-fallback">
          <span>
            {project.service && project.service !== "website-development"
              ? "Project artwork"
              : "Live business website"}
          </span>
          <p>
            Project image temporarily unavailable.
            <br />
            {project.liveUrl
              ? "Use the live website link to view the project."
              : project.videoUrl
                ? "Use the external video link to view the sample."
                : "You can still read the project details."}
          </p>
        </div>
      ) : !image.permissionConfirmed ? (
        /* Plain responsive image intentionally avoids the public optimizer/cache. */
        <img
          ref={(node) => {
            // A failed SSR image can finish before React attaches onError.
            if (node?.complete && node.naturalWidth === 0) setFailed(true);
          }}
          src={image.src}
          srcSet={[
            ...REVIEW_IMAGE_WIDTHS.filter((width) => width < image.width).map(
              (width) => `/review-media/starxco-${width}.webp ${width}w`,
            ),
            `${image.src} ${image.width}w`,
          ].join(", ")}
          sizes="(max-width:760px) calc(100vw - 32px), (max-width:1100px) 45vw, 560px"
          alt={image.alt}
          width={image.width}
          height={image.height}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <Image
          unoptimized={image.src.startsWith("/media/projects/")}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          sizes="(max-width:760px) 100vw, 50vw"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}
