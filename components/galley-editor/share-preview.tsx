"use client";

// How a post shows up when shared: as a search result and as a link card (X, Slack,
// LinkedIn), from its title, description and picture, or what they fall back to.

export function SharePreview({ url, title, description, image }: { url: string; title: string; description: string; image: string }) {
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];
  return (
    <div className="gx-share">
      <p className="gx-share-label">In search results</p>
      <div className="gx-serp">
        <span>{url.replace(/^https?:\/\//, "").replace(/\//g, " › ")}</span>
        <b>{title || "Untitled"}</b>
        <p>{description || "No description yet. Search engines will pick a passage from the post."}</p>
      </div>
      <p className="gx-share-label">When the link is shared</p>
      <div className="gx-linkcard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? <img src={image} alt="" /> : <span className="gx-linkcard-empty">No picture</span>}
        <div>
          <small>{domain}</small>
          <b>{title || "Untitled"}</b>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
    </div>
  );
}
