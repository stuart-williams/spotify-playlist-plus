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
  getRandomiseState,
} from "../../redux/playlists";
import Img from "react-image";
import {
  Tag,
  Button,
  ButtonGroup,
  Toaster,
  ProgressBar,
  Position,
  Intent,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  user: getUser(state),
  randomiseState: getRandomiseState(state),
});

const mapDispatch = {
  randomisePlaylist,
  fetchPlaylistById,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistHead = (props: Props) => {
  const { user, playlist, randomiseState } = props;
  const { id, name, images, owner, followers, tracks } = playlist;
  const isOwner = user.id === playlist.owner.id;
  const toaster = useRef<Toaster>();
  const duration = ms(
    tracks.items.reduce((d, item) => d + (item.track?.duration_ms || 0), 0),
    {
      unitCount: 2,
      secondsDecimalDigits: 0,
    }
  );

  const handleRandomise = async () => {
    toaster.current?.show(
      {
        timeout: 0,
        icon: "random",
        message: (
          <ProgressBar
            className="PlaylistHead__toast-progress"
            intent={Intent.PRIMARY}
            value={100}
          />
        ),
      },
      "pending"
    );

    const resultAction = await props.randomisePlaylist(playlist);

    toaster.current?.dismiss("pending");

    if (randomisePlaylist.fulfilled.match(resultAction)) {
      toaster.current?.show({
        icon: "tick",
        message: "Randomise Complete",
        intent: Intent.SUCCESS,
      });

      props.fetchPlaylistById(id);
    } else {
      toaster.current?.show({
        icon: "warning-sign",
        message: resultAction?.payload?.message || "Unknown Error",
        intent: Intent.DANGER,
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
      <MenuItem icon="sort-numerical" text="Tempo (Low to High)" />
      <MenuItem icon="sort-numerical-desc" text="Tempo (High to  Low)" />
    </Menu>
  );

  const buttons = (
    <ButtonGroup>
      <Button
        icon="random"
        disabled={randomiseState === "pending"}
        onClick={handleRandomise}
      >
        Randomise
      </Button>
      <Popover content={menu} position={Position.RIGHT_BOTTOM}>
        <Button icon="sort-asc">Sort</Button>
      </Popover>
    </ButtonGroup>
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
          </div>
          <div className="bp3-running-text">
            <div className="bp3-text-muted">By {owner.display_name}</div>
            <div className="bp3-text-muted bp3-text-small">
              {tracks.total}
              {" Songs • "}
              {duration}
            </div>
          </div>
          {isOwner && buttons}
        </div>
      </div>
    </>
  );
};

export default connector(PlaylistHead);
