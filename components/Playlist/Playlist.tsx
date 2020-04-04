import "./Playlist.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getFocusedPlaylist } from "../../redux/playlists";
import PlaylistHead from "../PlaylistHead";
import PlaylistTracks from "../PlaylistTracks";

const mapState = (state: RootState) => ({
  playlist: getFocusedPlaylist(state)
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const Playlist = (props: Props) => {
  const { id, tracks } = props.playlist;

  if (!id) {
    return null;
  }

  return (
    <div className="Playlist">
      <PlaylistHead playlist={props.playlist} />
      <PlaylistTracks tracks={tracks?.items} />
    </div>
  );
};

export default connector(Playlist);