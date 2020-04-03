import "./PlaylistHead.scss";

import React from "react";
import pluralize from "pluralize";
import {
  Tag,
  Button,
  Menu,
  MenuItem,
  Popover,
  Position
} from "@blueprintjs/core";

type Props = SpotifyApi.PlaylistObjectFull & {};

const PlaylistHead = (props: Props) => {
  const { name, images, owner, followers, tracks } = props;

  const tag = !!followers.total && (
    <Tag>
      {followers.total} {pluralize("Followers", followers.total)}
    </Tag>
  );

  const menu = (
    <Menu>
      <MenuItem icon="edit" text="Rename" />
      <MenuItem icon="random" text="Randomise Order" />
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

export default PlaylistHead;
