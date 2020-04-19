import React, { useRef } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { selectUser } from "../../redux/user";
import {
  getTopTracks,
  createTopTracksPlaylist,
  selectTopTracks,
} from "../../redux/top";
import { trackCreatedTopTracksPlaylist } from "../../common/analytics";
import * as topApi from "../../api/top";
import Track from "../Track";
import {
  Tabs,
  Tab,
  Button,
  Toaster,
  Position,
  Intent,
  Classes,
} from "@blueprintjs/core";
import Router from "next/router";
import Constants from "../../common/constants";

const mapState = (state: RootState) => ({
  user: selectUser(state),
  tracks: selectTopTracks(state),
});

const mapDispatch = {
  getTopTracks,
  createTopTracksPlaylist,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  tracks: SpotifyApi.UsersTopTracksResponse;
};

const TopTracks = (props: Props) => {
  const { user, tracks } = props;
  const toaster = useRef<Toaster>();
  const currTimeRange = (tracks.href.match(
    /time_range=(long_term|short_term)/
  )?.[1] || "medium_term") as topApi.TimeRange;

  const handleCreatePlaylist = async () => {
    const range = Constants.TIME_RANGES[currTimeRange].toLowerCase();
    const date = dayjs().format("MMM YYYY");
    const name = `Top ${tracks.total} tracks of ${range} (${date})`;

    const resultAction = await props.createTopTracksPlaylist({
      name,
      tracks: tracks.items,
    });

    if (createTopTracksPlaylist.fulfilled.match(resultAction)) {
      toaster.current?.show({
        icon: "tick",
        message: "Playlist Created",
        intent: Intent.SUCCESS,
      });

      trackCreatedTopTracksPlaylist(range);
      Router.push("/playlist/[id]", `/playlist/${resultAction.payload.id}`);
    } else {
      toaster.current?.show({
        icon: "warning-sign",
        message: resultAction?.payload?.message || "Unknown Error",
        intent: Intent.DANGER,
      });
    }
  };

  const renderTrack = (track: SpotifyApi.TrackObjectFull, i: number) => (
    <Track key={i} track={track} />
  );

  return (
    <div className="TopTracks">
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
      <div className="TopTracks__head">
        <h3 className={Classes.HEADING}>Top Tracks</h3>
        <Button icon="plus" onClick={handleCreatePlaylist}>
          Create Playlist
        </Button>
        <Tabs
          id="top_tracks"
          className="TopTracks__tabs"
          renderActiveTabPanelOnly={true}
          onChange={props.getTopTracks}
        >
          <Tab
            id="long_term"
            className="TopTracks__tab"
            title={Constants.TIME_RANGES.long_term}
            panel={<div />}
          />
          <Tab
            id="medium_term"
            className="TopTracks__tab"
            title={Constants.TIME_RANGES.medium_term}
            panel={<div />}
          />
          <Tab
            id="short_term"
            className="TopTracks__tab"
            title={Constants.TIME_RANGES.short_term}
            panel={<div />}
          />
        </Tabs>
      </div>
      <ul className={classNames("TopTracks__tracks", Classes.LIST_UNSTYLED)}>
        {tracks.items.map(renderTrack)}
      </ul>
    </div>
  );
};

export default connector(TopTracks);
