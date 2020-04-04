import "./PlaylistHead.scss";

import React, { useRef } from "react";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RootState } from "../../redux";
import pluralize from "pluralize";
import {
  randomisePlaylist,
  fetchPlaylistById,
  getRandomiseLoading
} from "../../redux/playlists";
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

const mapState = (state: RootState) => ({
  randomiseLoading: getRandomiseLoading(state)
});

const mapDispatch = {
  randomisePlaylist,
  fetchPlaylistById
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistHead = (props: Props) => {
  const { playlist, randomiseLoading } = props;
  const { id, name, images, owner, followers, tracks } = playlist;
  const toaster = useRef<Toaster>();

  const handleRandomise = async () => {
    toaster.current?.show(
      {
        timeout: 0,
        icon: "random",
        message: (
          <ProgressBar
            className="PlaylistHead__menu__toast-progress"
            intent={Intent.PRIMARY}
            value={100}
          />
        )
      },
      "pending"
    );

    const resultAction = await props.randomisePlaylist(playlist);

    toaster.current?.dismiss("pending");

    if (randomisePlaylist.fulfilled.match(resultAction)) {
      toaster.current?.show({
        icon: "tick",
        message: "So random",
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
      {new Intl.NumberFormat().format(followers.total)}{" "}
      {pluralize("Followers", followers.total)}
    </Tag>
  );

  const menu = (
    <Menu>
      <MenuItem icon="edit" text="Rename" />
      <MenuItem
        icon="random"
        text="Randomise Order"
        onClick={handleRandomise}
        disabled={randomiseLoading === "pending"}
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
