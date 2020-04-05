import "./PlaylistsMenu.scss";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import {
  getListOfPlaylists,
  fetchMyPlaylists,
  fetchPlaylistById
} from "../../redux/playlists";
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  playlists: getListOfPlaylists(state)
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
  const { playlists } = props;
  const router = useRouter();

  useEffect(() => {
    props.fetchMyPlaylists();
  }, []);

  const handleClick = (playlist: SpotifyApi.PlaylistObjectSimplified) => () => {
    router.replace(`/playlist/[id]`, `/playlist/${playlist.id}`, {
      shallow: true
    });
    props.fetchPlaylistById(playlist.id);
  };

  const renderMenuItem = (playlist: SpotifyApi.PlaylistObjectSimplified) => (
    <MenuItem
      key={playlist.id}
      text={playlist.name}
      icon={playlist.collaborative ? "people" : undefined}
      onClick={handleClick(playlist)}
    />
  );

  return (
    <div className="Playlists">
      <Menu>
        <MenuItem text="Create Playlist" icon="plus" />
        <MenuDivider />
      </Menu>
      <div className="Playlists__scroll-node">
        <Menu>{playlists.map(renderMenuItem)}</Menu>
      </div>
    </div>
  );
};

export default connector(PlaylistsMenu);
