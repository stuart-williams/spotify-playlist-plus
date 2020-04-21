import React, { useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../redux";
import {
  randomise,
  sortByAudioFeature,
  createPlaylist,
  getPlaylistById,
  selectSortState,
} from "../../redux/playlists";
import { SortByAudioFeatureOptions } from "../../api/playlists";
import {
  Button,
  Toaster,
  IToastProps,
  ProgressBar,
  Position,
  Intent,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import Router from "next/router";

const mapState = (state: RootState) => ({
  sortState: selectSortState(state),
});

const mapDispatch = {
  randomise,
  sortByAudioFeature,
  createPlaylist,
  getPlaylistById,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  className?: string;
  playlist: SpotifyApi.PlaylistObjectFull;
  isOwned: boolean;
};

const PlaylistControls = (props: Props) => {
  const { playlist, isOwned, sortState } = props;
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

  const handleSortByAudioFeature = async ({
    key,
    order,
  }: Pick<SortByAudioFeatureOptions, "key" | "order">) => {
    const resultAction = await props.sortByAudioFeature({
      playlist,
      key,
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
    pendingToast({ icon: "sort" });
    handleSortByAudioFeature({ key: "tempo", order: "ASC" });
  };

  const handleSortTempoDesc = async () => {
    pendingToast({ icon: "sort" });
    handleSortByAudioFeature({ key: "tempo", order: "DESC" });
  };

  const handleSortDanceabilityAsc = async () => {
    pendingToast({ icon: "sort" });
    handleSortByAudioFeature({ key: "danceability", order: "ASC" });
  };

  const handleSortDanceabilityDesc = async () => {
    pendingToast({ icon: "sort" });
    handleSortByAudioFeature({ key: "danceability", order: "DESC" });
  };

  const handleSortMoodAsc = async () => {
    pendingToast({ icon: "sort" });
    handleSortByAudioFeature({ key: "valence", order: "ASC" });
  };

  const handleSortMoodDesc = async () => {
    pendingToast({ icon: "sort" });
    handleSortByAudioFeature({ key: "valence", order: "DESC" });
  };

  const handleCopy = async () => {
    const resultAction = await props.createPlaylist({
      name: `${playlist.name} (copy)`,
      tracks: playlist.tracks.items.map((item) => item.track),
    });

    if (createPlaylist.fulfilled.match(resultAction)) {
      successToast({ message: "Playlist Created" });
      Router.push("/playlist/[id]", `/playlist/${resultAction.payload.id}`);
    } else {
      errorToast({ message: resultAction?.payload?.message });
    }
  };

  const menu = (
    <Menu>
      <MenuItem icon="duplicate" text="Copy" onClick={handleCopy} />
      <MenuItem
        icon="random"
        text="Randomise"
        disabled={!isOwned || sortState === "pending"}
        onClick={handleRandomise}
      />
      <MenuItem
        icon="sort"
        text="Sort"
        disabled={!isOwned || sortState === "pending"}
      >
        <MenuItem text="Tempo">
          <MenuItem
            icon="sort-asc"
            text="Slow to Fast"
            onClick={handleSortTempoAsc}
          />
          <MenuItem
            icon="sort-desc"
            text="Fast to Slow"
            onClick={handleSortTempoDesc}
          />
        </MenuItem>
        <MenuItem text="Danceability">
          <MenuItem
            icon="sort-asc"
            text="Low to High"
            onClick={handleSortDanceabilityAsc}
          />
          <MenuItem
            icon="sort-desc"
            text="High to Low"
            onClick={handleSortDanceabilityDesc}
          />
        </MenuItem>
        <MenuItem text="Mood">
          <MenuItem
            icon="sort-asc"
            text="Sad to Happy"
            onClick={handleSortMoodAsc}
          />
          <MenuItem
            icon="sort-desc"
            text="Happy to Sad"
            onClick={handleSortMoodDesc}
          />
        </MenuItem>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classNames("PlaylistControls", props.className)}>
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
      <Popover
        content={menu}
        position={Position.RIGHT_BOTTOM}
        autoFocus={false}
      >
        <Button icon="more" minimal={true} />
      </Popover>
    </div>
  );
};

export default connector(PlaylistControls);
