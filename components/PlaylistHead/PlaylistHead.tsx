import "./PlaylistHead.scss";

import React, { useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import pluralize from "pluralize";
import ms from "pretty-ms";
import { getUser } from "../../redux/user";
import {
  randomisePlaylist,
  fetchPlaylistById,
  getRandomiseState
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
  user: getUser(state),
  randomiseState: getRandomiseState(state)
});

const mapDispatch = {
  randomisePlaylist,
  fetchPlaylistById
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistHead = (props: Props) => {
  const { user, playlist, randomiseState } = props;
  const {
    id,
    name,
    images,
    owner,
    followers,
    tracks,
    collaborative,
    public: isPublic
  } = playlist;
  const userIsOwner = user.id === playlist.owner.id;
  const toaster = useRef<Toaster>();
  const duration = ms(
    tracks.items.reduce((d, item) => d + (item.track?.duration_ms || 0), 0),
    {
      unitCount: 2,
      secondsDecimalDigits: 0
    }
  );

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

  const ownerMenuItems = (
    <>
      <MenuItem icon="edit" text="Rename" />
      <MenuItem
        icon={isPublic ? "lock" : "unlock"}
        text={`Make ${isPublic ? "Private" : "Public"}`}
      />
      <MenuItem
        icon={collaborative ? "person" : "people"}
        text={`Make ${collaborative ? "Non-" : ""}Collaborative`}
      />
      <MenuItem
        icon="random"
        text="Randomise Order"
        onClick={handleRandomise}
        disabled={randomiseState === "pending"}
      />
    </>
  );

  const menu = (
    <Menu>
      {userIsOwner && ownerMenuItems}
      <MenuItem icon="heart" text="Unfollow" />
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
            <div className="bp3-text-muted">By {owner.display_name}</div>
            <div className="bp3-text-muted bp3-text-small">
              {tracks.total}
              {" Songs • "}
              {duration}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connector(PlaylistHead);
