import "./PlaylistsMenu.scss";

import React from "react";
import { useRouter } from "next/router";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getListOfPlaylists } from "../../redux/playlists";
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  playlists: getListOfPlaylists(state)
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

const PlaylistsMenu = (props: Props) => {
  const router = useRouter();

  const handleClick = (playlist: SpotifyApi.PlaylistObjectSimplified) => () => {
    router.replace(`/playlist/[id]`, `/playlist/${playlist.id}`);
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
        <Menu>{props.playlists.map(renderMenuItem)}</Menu>
      </div>
    </div>
  );
};

export default connector(PlaylistsMenu);
