import "./PlaylistControls.scss";

import React, { useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import {
  randomisePlaylist,
  fetchPlaylistById,
  getRandomiseState,
} from "../../redux/playlists";
import {
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
  randomiseState: getRandomiseState(state),
});

const mapDispatch = {
  randomisePlaylist,
  fetchPlaylistById,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistControls = (props: Props) => {
  const { playlist, randomiseState } = props;
  const toaster = useRef<Toaster>();

  const handleRandomise = async () => {
    toaster.current?.show(
      {
        timeout: 0,
        icon: "random",
        message: (
          <ProgressBar
            className="PlaylistControls__toast-progress"
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

      props.fetchPlaylistById(playlist.id);
    } else {
      toaster.current?.show({
        icon: "warning-sign",
        message: resultAction?.payload?.message || "Unknown Error",
        intent: Intent.DANGER,
      });
    }
  };

  const menu = (
    <Menu>
      <MenuItem icon="sort-numerical" text="Tempo (Low to High)" />
      <MenuItem icon="sort-numerical-desc" text="Tempo (High to  Low)" />
    </Menu>
  );

  return (
    <>
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
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
    </>
  );
};

export default connector(PlaylistControls);
