import "./PlaylistControls.scss";

import React, { useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../redux";
import {
  randomise,
  sortByAudioFeature,
  getPlaylistById,
  getSortState,
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

const mapState = (state: RootState) => ({
  sortState: getSortState(state),
});

const mapDispatch = {
  randomise,
  sortByAudioFeature,
  getPlaylistById,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  className?: string;
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistControls = (props: Props) => {
  const { playlist, sortState } = props;
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
    const resultAction = await props.randomise(playlist);
    toaster.current?.dismiss("pending");

    if (randomise.fulfilled.match(resultAction)) {
      successToast({ message: "Randomise Complete" });
      props.getPlaylistById(playlist.id);
    } else {
      errorToast({ message: resultAction?.payload?.message });
    }
  };

  const handleSortByTempo = async (order: "ASC" | "DESC") => {
    const resultAction = await props.sortByAudioFeature({
      playlist,
      key: "tempo",
      order,
    });

    if (sortByAudioFeature.fulfilled.match(resultAction)) {
      toaster.current?.dismiss("pending");
      props.getPlaylistById(playlist.id);
      successToast({ message: "Sort Complete" });
    } else {
      errorToast({ message: resultAction?.payload?.message });
    }
  };

  const handleSortTempoAsc = async () => {
    pendingToast({ icon: "sort-numerical" });
    handleSortByTempo("ASC");
  };

  const handleSortTempoDesc = async () => {
    pendingToast({ icon: "sort-numerical-desc" });
    handleSortByTempo("DESC");
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
    <div className={classNames("PlaylistControls", props.className)}>
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
      <ButtonGroup>
        <Button
          icon="random"
          disabled={sortState === "pending"}
          onClick={handleRandomise}
        >
          Randomise
        </Button>
        <Popover content={menu} position={Position.RIGHT_BOTTOM}>
          <Button icon="sort-asc" disabled={sortState === "pending"}>
            Sort
          </Button>
        </Popover>
      </ButtonGroup>
    </div>
  );
};

export default connector(PlaylistControls);
