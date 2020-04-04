import "./PlaylistHead.scss";

import React, { useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import pluralize from "pluralize";
import { randomisePlaylist, fetchPlaylistById } from "../../redux/playlists";
import Img from "react-image";
import {
  Tag,
  Button,
  Menu,
  MenuItem,
  Popover,
  Toaster,
  ProgressBar,
  Position,
  Intent
} from "@blueprintjs/core";

const mapDispatch = {
  randomisePlaylist,
  fetchPlaylistById
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistHead = (props: Props) => {
  const { id, name, images, owner, followers, tracks } = props.playlist;
  const toaster = useRef<Toaster>();

  const handleRandomise = async () => {
    toaster.current?.show(
      {
        icon: "random",
        message: <ProgressBar intent={Intent.PRIMARY} value={100} />
      },
      "pending"
    );

    const resultAction = await props.randomisePlaylist(props.playlist);

    toaster.current?.dismiss("pending");

    if (randomisePlaylist.fulfilled.match(resultAction)) {
      toaster.current?.show({
        icon: "tick",
        message: "Done",
        intent: Intent.SUCCESS
      });

      props.fetchPlaylistById(id);
    } else {
      toaster.current?.show({
        icon: "warning-sign",
        message: resultAction?.payload?.message || "Unknown error",
        intent: Intent.DANGER
      });
    }
  };

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
    <>
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
      <div className="PlaylistHead">
        <div className="PlaylistHead__image">
          <Img src={images?.[0]?.url} alt={name} />
        </div>
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
    </>
  );
};

export default connector(PlaylistHead);
