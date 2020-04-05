import "./PlaylistsMenu.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getListOfPlaylists } from "../../redux/playlists";
import Link from "next/link";

const mapState = (state: RootState) => ({
  playlists: getListOfPlaylists(state)
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

const PlaylistsMenu = (props: Props) => {
  const renderMenuItem = (playlist: SpotifyApi.PlaylistObjectSimplified) => (
    <li key={playlist.id}>
      <Link href="/playlist/[id]" as={`/playlist/${playlist.id}`}>
        <a className="bp3-menu-item">
          <span className="bp3-text-overflow-ellipsis bp3-fill">
            {playlist.name}
          </span>
        </a>
      </Link>
    </li>
  );

  return (
    <div className="Playlists">
      <ul className="Playlists__scroll bp3-list-unstyled">
        {props.playlists.map(renderMenuItem)}
      </ul>
    </div>
  );
};

export default connector(PlaylistsMenu);
