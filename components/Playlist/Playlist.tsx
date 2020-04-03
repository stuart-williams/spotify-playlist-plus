import "./Playlist.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import pluralize from "pluralize";
import { RootState } from "../../redux";
import { getFocusedPlaylist } from "../../redux/playlists";
import PlaylistTracks from "../PlaylistTracks";
import { Tag } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  playlist: getFocusedPlaylist(state)
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const Playlist = (props: Props) => {
  if (!props.playlist.id) {
    return null;
  }

  const { name, images, owner, followers, tracks } = props.playlist;

  return (
    <div className="Playlist">
      {/* // TODO: extract <PlaylistHead /> */}
      <div className="PlaylistHead">
        <img className="PlaylistHead__image" src={images?.[0]?.url} />
        <div className="PlaylistHead__meta">
          <div className="PlaylistHead__title">
            <h3 className="bp3-heading">{name}</h3>
            <div className="PlaylistHead__tag">
              {!!followers.total && (
                <Tag>
                  {followers.total} {pluralize("Followers", followers.total)}
                </Tag>
              )}
            </div>
          </div>
          <div className="bp3-running-text">
            <div className="bp3-text-muted">{owner.display_name}</div>
            <div className="bp3-text-muted bp3-text-small">
              {tracks.total} Songs
            </div>
          </div>
        </div>
      </div>
      <PlaylistTracks tracks={tracks?.items} />
    </div>
  );
};

export default connector(Playlist);
