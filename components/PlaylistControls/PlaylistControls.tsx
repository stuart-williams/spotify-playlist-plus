import React from "react";
import { connect, ConnectedProps } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../redux";
import { useToast } from "../../common/toast";
import {
  randomise,
  sortByAudioFeature,
  createPlaylist,
  getPlaylistById,
  selectSortState,
} from "../../redux/playlists";
import { SortByAudioFeatureOptions } from "../../api/playlists";
import { Button, Position, Menu, MenuItem, Popover } from "@blueprintjs/core";
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
  const toast = useToast();

  const handleRandomise = async () => {
    toast?.showPending({ icon: "random" });
    const resultAction = await props.randomise(playlist);
    toast?.clear();

    if (randomise.fulfilled.match(resultAction)) {
      toast?.showSuccess({ message: "Randomise Complete" });
      props.getPlaylistById(playlist.id);
    } else {
      toast?.showError({ message: resultAction?.payload?.message });
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
      toast?.clear();
      props.getPlaylistById(playlist.id);
      toast?.showSuccess({ message: "Sort Complete" });
    } else {
      toast?.showError({ message: resultAction?.payload?.message });
    }
  };

  const handleSortTempoAsc = async () => {
    toast?.showPending({ icon: "sort" });
    handleSortByAudioFeature({ key: "tempo", order: "ASC" });
  };

  const handleSortTempoDesc = async () => {
    toast?.showPending({ icon: "sort" });
    handleSortByAudioFeature({ key: "tempo", order: "DESC" });
  };

  const handleSortDanceabilityAsc = async () => {
    toast?.showPending({ icon: "sort" });
    handleSortByAudioFeature({ key: "danceability", order: "ASC" });
  };

  const handleSortDanceabilityDesc = async () => {
    toast?.showPending({ icon: "sort" });
    handleSortByAudioFeature({ key: "danceability", order: "DESC" });
  };

  const handleSortMoodAsc = async () => {
    toast?.showPending({ icon: "sort" });
    handleSortByAudioFeature({ key: "valence", order: "ASC" });
  };

  const handleSortMoodDesc = async () => {
    toast?.showPending({ icon: "sort" });
    handleSortByAudioFeature({ key: "valence", order: "DESC" });
  };

  const handleCopy = async () => {
    const resultAction = await props.createPlaylist({
      name: `${playlist.name} (copy)`,
      tracks: playlist.tracks.items.map((item) => item.track),
    });

    if (createPlaylist.fulfilled.match(resultAction)) {
      toast?.showSuccess({ message: "Playlist Created" });
      Router.push("/playlist/[id]", `/playlist/${resultAction.payload.id}`);
    } else {
      toast?.showError({ message: resultAction?.payload?.message });
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
