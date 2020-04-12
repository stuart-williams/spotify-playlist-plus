import "./Track.scss";

import React from "react";
import ms from "pretty-ms";

const DIVIDER = " • ";

const Track = ({ track, added_by }: SpotifyApi.PlaylistTrackObject) => {
  const duration = ms(track.duration_ms, {
    colonNotation: true,
    secondsDecimalDigits: 0,
  });

  const addedBy = isNaN(+added_by.id) && (
    <>
      <a
        href={added_by.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
      >
        {added_by.id}
      </a>
      {DIVIDER}
    </>
  );

  const artists = track.artists.map(({ id, name, external_urls }, i, arr) => (
    <span key={id}>
      <a href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
      {arr[i + 1] ? ", " : ""}
    </span>
  ));

  return (
    <div className="Track bp3-running-text">
      <div>
        <a
          className="bp3-text-large"
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {track.name}
        </a>
        <div className="bp3-text-muted bp3-text-small">
          {addedBy}
          {artists}
          {DIVIDER}
          <a
            href={track.album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            {track.album.name}
          </a>
        </div>
      </div>
      {duration}
    </div>
  );
};

export default Track;
