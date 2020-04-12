import "./PlaylistTracks.scss";

import React from "react";
import ms from "pretty-ms";
import { HTMLTable } from "@blueprintjs/core";

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

    return (
      <tr key={track.id}>
        <td className="PlaylistTracks__track bp3-running-text">
          <div>
            {track.name}
            <div className="bp3-text-muted bp3-text-small">
              {collaborative && isNaN(+added_by.id) && `${added_by.id}  • `}
              {track.artists.map(({ name }) => name).join(", ")}
              {" • "}
              {track.album.name}
            </div>
          </div>
          {duration}
        </td>
      </tr>
    );
  };

  return (
    <div className="PlaylistTracks">
      <HTMLTable bordered={false}>
        <tbody>{tracks.items.map(renderTrack)}</tbody>
      </HTMLTable>
    </div>
  );
};

export default PlaylistTracks;
