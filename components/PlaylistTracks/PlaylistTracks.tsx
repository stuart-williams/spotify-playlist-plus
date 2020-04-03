import "./PlaylistTracks.scss";

import React from "react";
import { HTMLTable } from "@blueprintjs/core";

type Props = {
  tracks: SpotifyApi.PlaylistTrackObject[];
};

const PlaylistTracks = (props: Props) => {
  const { tracks = [] } = props;

  const renderTrack = (item: SpotifyApi.PlaylistTrackObject) => {
    const { track } = item;

    if (!track) {
      return null;
    }

    return (
      <tr key={track.id}>
        <td className="bp3-running-text">
          <div>{track.name}</div>
          <div className="bp3-text-muted bp3-text-small">
            {track.artists.map(({ name }) => name).join(", ")}
            {" • "}
            {track.album.name}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="PlaylistTracks">
      <HTMLTable bordered={false} striped={true} interactive={true}>
        <tbody>{tracks.map(renderTrack)}</tbody>
      </HTMLTable>
    </div>
  );
};

export default PlaylistTracks;
