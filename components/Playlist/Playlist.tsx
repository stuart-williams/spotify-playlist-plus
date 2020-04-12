import "./Playlist.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getPlaylist } from "../../redux/playlists";
import PlaylistHead from "../PlaylistHead";
import PlaylistTracks from "../PlaylistTracks";
import { NonIdealState, AnchorButton } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  playlist: getPlaylist(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const Playlist = ({ playlist }: Props) => {
  const isEmpty = !playlist.tracks.items.length;

  const action = (
    <AnchorButton
      href={playlist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Spotify
    </AnchorButton>
  );

  const empty = (
    <NonIdealState
      title="It's a bit empty here..."
      description="Let's find some songs for your playlist"
      action={action}
    />
  );

  return (
    <div className="Playlist">
      <PlaylistHead playlist={playlist} />
      {isEmpty ? empty : <PlaylistTracks playlist={playlist} />}
    </div>
  );
};

export default connector(Playlist);
