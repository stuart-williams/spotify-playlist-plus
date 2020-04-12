import "./Playlist.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getUser } from "../../redux/user";
import { getPlaylist } from "../../redux/playlists";
import PlaylistHead from "../PlaylistHead";
import { PlaylistTracks, PlaylistTracksDnD } from "../PlaylistTracks";
import { NonIdealState, AnchorButton } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  user: getUser(state),
  playlist: getPlaylist(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  playlist: SpotifyApi.PlaylistObjectFull;
};

const Playlist = ({ user, playlist }: Props) => {
  const isOwner = user.id === playlist.owner.id;
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

  const empty = isEmpty && (
    <NonIdealState
      title="It's a bit empty here..."
      description="Let's find some songs for your playlist"
      action={action}
    />
  );

  const staticTracks = !isEmpty && !isOwner && (
    <PlaylistTracks playlist={playlist} />
  );

  const dndTracks = !isEmpty && isOwner && (
    <PlaylistTracksDnD playlist={playlist} />
  );

  return (
    <div className="Playlist">
      <PlaylistHead playlist={playlist} />
      {empty}
      {staticTracks}
      {dndTracks}
    </div>
  );
};

export default connector(Playlist);
