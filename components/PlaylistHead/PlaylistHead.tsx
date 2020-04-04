import "./PlaylistHead.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import pluralize from "pluralize";
import { randomisePlaylist } from "../../redux/playlists";
import {
  Tag,
  Button,
  Menu,
  MenuItem,
  Popover,
  Position
} from "@blueprintjs/core";

const mapDispatch = {
  randomisePlaylist
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistHead = (props: Props) => {
  const { id, name, images, owner, followers, tracks } = props.playlist;
  const handleRandomise = () => props.randomisePlaylist(props.playlist);

  const tag = !!followers.total && (
    <Tag>
      {followers.total} {pluralize("Followers", followers.total)}
    </Tag>
  );

  const menu = (
    <Menu>
      <MenuItem icon="edit" text="Rename" />
      <MenuItem
        icon="random"
        text="Randomise Order"
        onClick={handleRandomise}
      />
      <MenuItem icon="heart-broken" text="Unfollow" />
    </Menu>
  );

  return (
    <div className="PlaylistHead">
      <img className="PlaylistHead__image" src={images[0].url} alt={name} />
      <div className="PlaylistHead__meta">
        <div className="PlaylistHead__title">
          <h3 className="bp3-heading">{name}</h3>
          <div className="PlaylistHead__tag">{tag}</div>
          <div className="PlaylistHead__menu">
            <Popover content={menu} position={Position.RIGHT_BOTTOM}>
              <Button icon="more" />
            </Popover>
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
  );
};

export default connector(PlaylistHead);
