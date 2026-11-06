"use client";

import { useId, useState, type ChangeEvent } from "react";
import type { CmsTeamMember } from "@/lib/cms/schema";
import { initialTeam, teamRoleTemplates } from "@/config/team";

export function TeamContentEditor({
  members,
  onChange,
  onUpload,
}: {
  members: CmsTeamMember[];
  onChange: (members: CmsTeamMember[]) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
}) {
  const [active, setActive] = useState(members[0]?.id ?? "");
  const bioHelpId = useId();
  const photoHelpId = useId();
  const member = members.find((item) => item.id === active);
  const update = (values: Partial<CmsTeamMember>) =>
    onChange(
      members.map((item) =>
        item.id === active ? { ...item, ...values } : item,
      ),
    );
  const add = () => {
    const id = crypto.randomUUID();
    onChange([
      ...members,
      {
        id,
        name: "",
        role: "",
        bio: "",
        image: null,
        published: false,
        publicationConfirmed: false,
      },
    ]);
    setActive(id);
  };
  const move = (offset: number) => {
    const index = members.findIndex((item) => item.id === active);
    const next = index + offset;
    if (index < 0 || next < 0 || next >= members.length) return;
    const reordered = [...members];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    onChange(reordered);
  };
  return (
    <div>
      <h2>About page team</h2>
      <p>
        Manage names, responsibilities, short bios and optional photos. These
        public profiles do not create accounts or grant administrator access.
      </p>
      <div className="cms-project-layout cms-team-layout">
        <aside aria-label="Team member list">
          <button
            className="button button--primary button--small"
            type="button"
            onClick={add}
            disabled={members.length >= 12}
          >
            Add team member
          </button>
          {members.length === 0 && (
            <button
              className="button button--outline button--small"
              type="button"
              onClick={() => {
                onChange(
                  initialTeam.map((item) => ({
                    ...item,
                    published: false,
                    publicationConfirmed: false,
                  })),
                );
                setActive(initialTeam[0].id);
              }}
            >
              Load Growthly starter profiles
            </button>
          )}
          <div className="cms-project-list">
            {members.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={active === item.id}
                onClick={() => setActive(item.id)}
              >
                {item.name || "New team member"}
                <small>
                  {item.published
                    ? "Included on publication"
                    : "Hidden / draft"}
                </small>
              </button>
            ))}
          </div>
        </aside>
        {member ? (
          <div>
            <h3>{member.name || "New team member"}</h3>
            <label className="cms-field">
              <span>Team member name</span>
              <input
                value={member.name}
                maxLength={100}
                onChange={(e) => update({ name: e.target.value })}
              />
            </label>
            <label className="cms-field">
              <span>Team member role</span>
              <input
                value={member.role}
                maxLength={160}
                onChange={(e) => update({ role: e.target.value })}
              />
            </label>
            <label className="cms-field">
              <span>Role template</span>
              <select
                aria-label="Role template"
                value=""
                onChange={(e) => {
                  const template = teamRoleTemplates.find(
                    (item) => item.role === e.target.value,
                  );
                  if (template)
                    update({ role: template.role, bio: template.bio });
                }}
              >
                <option value="">
                  Choose a starter — replaces role and bio
                </option>
                {teamRoleTemplates.map((item) => (
                  <option key={item.role} value={item.role}>
                    {item.role}
                  </option>
                ))}
              </select>
            </label>
            <label className="cms-field">
              <span>Team member biography</span>
              <textarea
                aria-label="Team member biography"
                aria-describedby={bioHelpId}
                value={member.bio}
                maxLength={700}
                rows={4}
                onChange={(e) => update({ bio: e.target.value })}
              />
              <small id={bioHelpId}>
                Keep it factual. Review template wording before publishing; do
                not add invented experience, credentials or results.
              </small>
            </label>
            <h4>Profile photo</h4>
            <label className="cms-field">
              <span>Upload team photo</span>
              <input
                type="file"
                aria-label="Upload team photo"
                aria-describedby={photoHelpId}
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => onUpload(event, member.id)}
              />
              <small id={photoHelpId}>
                Optional JPEG, PNG or WebP under 2 MB. Initials appear until a
                permitted photo is published.
              </small>
            </label>
            {member.image && (
              <>
                <div className="cms-image-preview">
                  {/* Private no-store media must bypass the shared image optimizer. */}
                  <img
                    src={`/api/admin/content/media/${member.image.assetId}`}
                    width={member.image.width}
                    height={member.image.height}
                    alt={member.image.alt || "Private team photo preview"}
                  />
                </div>
                <label className="cms-field">
                  <span>Team photo description</span>
                  <input
                    value={member.image.alt}
                    maxLength={300}
                    onChange={(e) =>
                      update({
                        image: { ...member.image!, alt: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="cms-field">
                  <span>Team photo source credit</span>
                  <input
                    value={member.image.credit}
                    maxLength={300}
                    onChange={(e) =>
                      update({
                        image: { ...member.image!, credit: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="cms-check">
                  <input
                    type="checkbox"
                    checked={member.image.permissionConfirmed}
                    onChange={(e) =>
                      update({
                        image: {
                          ...member.image!,
                          permissionConfirmed: e.target.checked,
                        },
                      })
                    }
                  />
                  I have permission to publish this team photo.
                </label>
                <button
                  className="button button--outline button--small"
                  type="button"
                  onClick={() => update({ image: null })}
                >
                  Remove team photo
                </button>
              </>
            )}
            <label className="cms-check">
              <input
                type="checkbox"
                checked={member.publicationConfirmed}
                onChange={(e) =>
                  update({ publicationConfirmed: e.target.checked })
                }
              />
              I have reviewed this profile and have permission to publish it.
            </label>
            <label className="cms-check">
              <input
                type="checkbox"
                checked={member.published}
                onChange={(e) => update({ published: e.target.checked })}
              />
              Include this team member on the next publication.
            </label>
            <details className="cms-draft-preview">
              <summary>Preview this team profile</summary>
              <h4>{member.name || "Name to add"}</h4>
              <p>{member.role || "Role to add"}</p>
              <p>{member.bio || "Add a short factual biography."}</p>
              <p className="form-fineprint">
                Private draft preview. Save and Publish are separate steps.
              </p>
            </details>
            <div className="cms-row-actions">
              <button
                className="button button--outline button--small"
                type="button"
                disabled={members[0]?.id === active}
                onClick={() => move(-1)}
              >
                Move team member earlier
              </button>
              <button
                className="button button--outline button--small"
                type="button"
                disabled={members.at(-1)?.id === active}
                onClick={() => move(1)}
              >
                Move team member later
              </button>
              <button
                className="button button--outline button--small"
                type="button"
                onClick={() => {
                  if (
                    !confirm(
                      "Remove this team profile from the draft? The public site changes only after Publish.",
                    )
                  )
                    return;
                  const next = members.filter((item) => item.id !== active);
                  onChange(next);
                  setActive(next[0]?.id ?? "");
                }}
              >
                Remove team member from draft
              </button>
            </div>
          </div>
        ) : (
          <p>
            Select a team member or add a profile. Published profiles can be
            hidden without deleting their draft details.
          </p>
        )}
      </div>
    </div>
  );
}
