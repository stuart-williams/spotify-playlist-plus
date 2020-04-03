import "./PlaylistsMenu.scss";

import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import {
  getPlaylists,
  fetchMyPlaylists,
  fetchPlaylistById
} from "../../redux/playlists";
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  playlists: getPlaylists(state)
});

const mapDispatch = {
  fetchMyPlaylists,
  fetchPlaylistById
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

const PlaylistsMenu = (props: Props) => {
  useEffect(() => {
    props.fetchMyPlaylists();
  }, []);

  const handlePlaylistClick = (
    playlist: SpotifyApi.PlaylistObjectSimplified
  ) => () => {
    props.fetchPlaylistById(playlist.id);
  };

  return (
    <div className="Playlists">
      <Menu>
        <MenuItem text="Create Playlist" icon="plus" />
        <MenuDivider />
      </Menu>
      <div className="Playlists__scroll-node">
        <Menu>
          {props.playlists.map(playlist => (
            <MenuItem
              key={playlist.id}
              text={playlist.name}
              icon={playlist.collaborative ? "dot" : undefined}
              onClick={handlePlaylistClick(playlist)}
            />
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default connector(PlaylistsMenu);
