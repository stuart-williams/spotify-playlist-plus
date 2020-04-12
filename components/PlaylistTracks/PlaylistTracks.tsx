import "./PlaylistTracks.scss";

import React from "react";
import Track from "../Track";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = ({ playlist }: Props) => {
  const renderTrack = (item: SpotifyApi.PlaylistTrackObject) => {
    if (item.track) {
      return (
        <li>
          <Track {...item} />
        </li>
      );
    }
  };

  return (
    <ul className="PlaylistTracks bp3-list-unstyled">
      {playlist.tracks.items.map(renderTrack)}
    </ul>
  );
};

export default PlaylistTracks;
