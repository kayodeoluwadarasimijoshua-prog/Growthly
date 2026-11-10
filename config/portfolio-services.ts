export const portfolioServices = [
  {
    slug: "website-development",
    label: "Websites",
    title: "Websites with a clear purpose.",
    description:
      "Explore business websites and clearly labelled demonstrations, with the scope and decisions behind each build.",
  },
  {
    slug: "graphic-design",
    label: "Graphic design",
    title: "Design that gives your message a clear identity.",
    description:
      "A space for approved brand, promotional and campaign artwork. Each published project explains the brief and the work delivered.",
  },
  {
    slug: "ai-video-adverts",
    label: "AI adverts",
    title: "Video creative built around your message.",
    description:
      "Explore approved AI-assisted advert projects, their creative direction and available video samples.",
  },
] as const;
export const galleryPath = (slug: string) => `/portfolio/services/${slug}`;
export const getPortfolioService = (slug: string) =>
  portfolioServices.find((service) => service.slug === slug);
