import "./PlaylistTracks.scss";

import React from "react";
import Track from "../Track";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = ({ playlist }: Props) => {
  const track = (item: SpotifyApi.PlaylistTrackObject) =>
    item.track && (
      <li key={item.track.id}>
        <Track {...item} />
      </li>
    );

  return (
    <ul className="PlaylistTracks bp3-list-unstyled">
      {playlist.tracks.items.map(track)}
    </ul>
  );
};

export default PlaylistTracks;
