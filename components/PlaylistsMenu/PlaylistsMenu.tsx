import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getPlaylists, fetchPlaylists } from "../../redux/playlists";
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import styles from "./styles";

const mapState = (state: RootState) => ({
  playlists: getPlaylists(state)
});

const mapDispatch = {
  fetchPlaylists
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

const PlaylistsMenu = (props: Props) => {
  useEffect(() => {
    props.fetchPlaylists();
  }, []);

  return (
    <div className="Playlists">
      <Menu>
        <MenuDivider title="PLAYLISTS" />
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
            />
          ))}
        </Menu>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default connector(PlaylistsMenu);
