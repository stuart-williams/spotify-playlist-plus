import React from "react";
import classNames from "classnames";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { selectUser } from "../../redux/user";
import { selectListOfPlaylists } from "../../redux/playlists";
import Link from "next/link";
import { Classes } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  user: selectUser(state),
  playlists: selectListOfPlaylists(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

const PlaylistsMenu = (props: Props) => {
  const renderMenuItem = (playlist: SpotifyApi.PlaylistObjectSimplified) => {
    const isOwner = playlist.owner.id === props.user.id;
    const classes = classNames(Classes.TEXT_OVERFLOW_ELLIPSIS, Classes.FILL, {
      [Classes.TEXT_MUTED]: !isOwner,
    });

    return (
      <li key={playlist.id}>
        <Link href="/playlist/[id]" as={`/playlist/${playlist.id}`}>
          <a className={Classes.MENU_ITEM}>
            <span className={classes}>{playlist.name}</span>
          </a>
        </Link>
      </li>
    );
  };

  return (
    <div className="Playlists">
      <ul className={classNames("Playlists__scroll", Classes.LIST_UNSTYLED)}>
        {props.playlists.map(renderMenuItem)}
      </ul>
    </div>
  );
};

export default connector(PlaylistsMenu);
