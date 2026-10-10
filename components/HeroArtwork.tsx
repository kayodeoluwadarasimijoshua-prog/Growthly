import { PanelsTopLeft, PenTool } from "lucide-react";

export function HeroArtwork() {
  return (
    <figure className="hero-art" aria-label="A custom GROWTHLY creative project mockup">
      <div className="hero-art__canvas" aria-hidden="true" />
      <div className="hero-browser" aria-hidden="true">
        <div className="hero-browser__bar">
          <i /><i /><i />
          <span className="hero-browser__address" />
        </div>
        <div className="hero-browser__screen">
          <div className="hero-browser__message">
            <small>CARE, ROOTED IN NATURE</small>
            <strong>A softer<br />kind of care.</strong>
            <span>Thoughtful essentials for your everyday ritual.</span>
            <b>EXPLORE THE SET</b>
          </div>
          <div className="hero-browser__product">
            <div className="product-bottle" />
          </div>
        </div>
      </div>
      <div className="hero-service-tag hero-service-tag--top" aria-hidden="true">
        <PenTool size={16} /> Graphic design
      </div>
      <div className="hero-service-tag hero-service-tag--bottom" aria-hidden="true">
        <PanelsTopLeft size={16} /> Website development
      </div>
      <div className="hero-art-caption">A self-initiated retail concept</div>
      <figcaption className="sr-only">
        Original mockup for Kora Botanics, a fictional retail concept. The product preview is illustrative and does not represent a client project.
      </figcaption>
    </figure>
  );
}
