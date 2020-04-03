import "./PlaylistTracks.scss";

import React from "react";
import { HTMLTable } from "@blueprintjs/core";

type Props = {
  tracks: SpotifyApi.PlaylistTrackObject[];
};

const PlaylistTracks = (props: Props) => {
  const { tracks = [] } = props;

  return (
    <div className="PlaylistTracks">
      <HTMLTable bordered={false} striped interactive>
        <tbody>
          {tracks.map(item => {
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
                    &nbsp;&nbsp;•&nbsp;&nbsp;
                    {track.album.name}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>
    </div>
  );
};

export default PlaylistTracks;
