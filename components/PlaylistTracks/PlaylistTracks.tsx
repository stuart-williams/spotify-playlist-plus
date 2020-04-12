import "./PlaylistTracks.scss";

import React from "react";
import ms from "pretty-ms";

const DIVIDER = " • ";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = (props: Props) => {
  const { tracks, collaborative } = props.playlist;

  const renderTrack = (item: SpotifyApi.PlaylistTrackObject) => {
    const { track, added_by } = item;

    if (!track) {
      return null;
    }

    const duration = ms(track.duration_ms, {
      colonNotation: true,
      secondsDecimalDigits: 0,
    });

    const addedBy = collaborative && isNaN(+added_by.id) && (
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
        <a
          href={external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
        {arr[i + 1] ? ", " : ""}
      </span>
    ));

    return (
      <li key={track.id} className="PlaylistTracks__track bp3-running-text">
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
      </li>
    );
  };

  return (
    <ul className="PlaylistTracks bp3-list-unstyled">
      {tracks.items.map(renderTrack)}
    </ul>
  );
};

export default PlaylistTracks;
