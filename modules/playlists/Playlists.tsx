import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getPlaylists, fetchPlaylists } from "./redux";
import { Classes, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

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

const Playlists = (props: Props) => {
  useEffect(() => {
    props.fetchPlaylists();
  }, []);

  return (
    <div style={{ width: 300 }}>
      <Menu className={Classes.ELEVATION_1}>
        <li className="bp3-menu-header">
          <h6 className="bp3-heading">PLAYLISTS</h6>
        </li>
        <MenuItem text="New Playlist" icon="plus" />
        <MenuDivider />
        {props.playlists.map(playlist => (
          <MenuItem
            key={playlist.id}
            text={playlist.name}
            icon={playlist.collaborative ? "people" : undefined}
          />
        ))}
      </Menu>
    </div>
  );
};

export default connector(Playlists);
