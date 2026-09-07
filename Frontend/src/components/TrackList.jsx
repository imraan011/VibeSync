import React from "react";
import TrackItem from "./TrackItem";
import "./TrackList.css";

export default function TrackList({ tracks }) {
  return (
    <section className="track-list" aria-label="Recommended Tracks">
      <h2 className="track-list__heading">Recommended Tracks</h2>
      <ul className="track-list__items">
        {tracks.map((track) => (
          <TrackItem key={track.id} title={track.title} artist={track.artist} />
        ))}
      </ul>
    </section>
  );
}
