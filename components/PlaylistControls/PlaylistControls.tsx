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
  IToastProps,
  ProgressBar,
  Position,
  Intent,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import * as playlistApi from "../../api/playlists";

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

  const pendingToast = ({ icon }: Pick<IToastProps, "icon">) => {
    toaster.current?.show(
      {
        timeout: 0,
        icon,
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
  };

  const successToast = ({ message }: Pick<IToastProps, "message">) => {
    toaster.current?.show({
      icon: "tick",
      message,
      intent: Intent.SUCCESS,
    });
  };

  const errorToast = ({ message }: Pick<IToastProps, "message">) => {
    toaster.current?.show({
      icon: "warning-sign",
      message: message || "Unknown Error",
      intent: Intent.DANGER,
    });
  };

  const handleRandomise = async () => {
    pendingToast({ icon: "random" });
    const resultAction = await props.randomisePlaylist(playlist);
    toaster.current?.dismiss("pending");

    if (randomisePlaylist.fulfilled.match(resultAction)) {
      successToast({ message: "Randomise Complete" });
      props.fetchPlaylistById(playlist.id);
    } else {
      errorToast({ message: resultAction?.payload?.message });
    }
  };

  // TODO: Error handling
  const handleSortTempoAsc = async () => {
    pendingToast({ icon: "sort-numerical" });

    try {
      await playlistApi.sortByAudioFeature(playlist, "tempo", "ASC");
      toaster.current?.dismiss("pending");
      props.fetchPlaylistById(playlist.id);
      successToast({ message: "Sort Complete" });
    } catch (error) {}
  };

  // TODO: Error handling
  const handleSortTempoDesc = async () => {
    pendingToast({ icon: "sort-numerical-desc" });

    try {
      await playlistApi.sortByAudioFeature(playlist, "tempo", "DESC");
      toaster.current?.dismiss("pending");
      props.fetchPlaylistById(playlist.id);
      successToast({ message: "Sort Complete" });
    } catch (error) {}
  };

  const menu = (
    <Menu>
      <MenuItem
        icon="sort-numerical"
        text="Tempo (Low to High)"
        onClick={handleSortTempoAsc}
      />
      <MenuItem
        icon="sort-numerical-desc"
        text="Tempo (High to  Low)"
        onClick={handleSortTempoDesc}
      />
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
