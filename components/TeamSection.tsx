import { getPublishedTeam } from "@/lib/cms/public";

export async function TeamSection() {
  const team = await getPublishedTeam();
  if (!team.length) return null;
  return (
    <section
      className="section section--soft"
      id="our-team"
      aria-labelledby="team-heading"
    >
      <div className="container">
        <div className="section-head">
          <div className="section-head__copy">
            <span className="eyebrow">The people behind Growthly</span>
            <h2 id="team-heading">Meet the team.</h2>
            <p>
              Website development, creative work and day-to-day support, with
              responsibilities you can understand.
            </p>
          </div>
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <article className="team-card" key={member.id}>
              {member.image?.permissionConfirmed ? (
                // Revocable CMS photos use no-store media, never the shared image optimizer.
                <img
                  className="team-card__photo"
                  src={`/media/projects/${member.image.assetId}`}
                  width={member.image.width}
                  height={member.image.height}
                  alt={member.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="team-card__initials" aria-hidden="true">
                  {member.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
              )}
              <h3>{member.name}</h3>
              <p className="team-card__role">{member.role}</p>
              <p>{member.bio}</p>
              {member.image?.credit && (
                <p className="team-card__credit">
                  Photo: {member.image.credit}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
