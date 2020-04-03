import "./PlaylistTracks.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getFocusedPlaylist } from "../../redux/playlists";
import { HTMLTable } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  playlist: getFocusedPlaylist(state)
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = (props: Props) => {
  return (
    <div className="PlaylistTracks">
      <HTMLTable bordered={false} striped interactive>
        <tbody>
          {(props.playlist.tracks?.items || []).map(item => {
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

export default connector(PlaylistTracks);
