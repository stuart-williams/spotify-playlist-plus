import React from "react";
import classNames from "classnames";
import Track from "../Track";
import { Classes } from "@blueprintjs/core";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = ({ playlist }: Props) => {
  const renderTrack = (item: SpotifyApi.PlaylistTrackObject) => {
    if (item.track) {
      return (
        <li key={item.track.id}>
          <Track {...item} />
        </li>
      );
    }
  };

  return (
    <ul className={classNames("PlaylistTracks", Classes.LIST_UNSTYLED)}>
      {playlist.tracks.items.map(renderTrack)}
    </ul>
  );
};

export default PlaylistTracks;
