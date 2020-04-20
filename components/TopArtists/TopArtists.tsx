import React, { useRef } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import {
  getTopArtists,
  createTopTracksPlaylist,
  selectTopArtistsTracks,
  selectTopArtistsTimeRange,
} from "../../redux/top";
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
  tracks: selectTopArtistsTracks(state),
  timeRange: selectTopArtistsTimeRange(state),
});

const mapDispatch = {
  getTopArtists,
  createTopTracksPlaylist,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  tracks: SpotifyApi.TrackObjectFull[];
  timeRange: topApi.TimeRange;
};

const TopArtists = (props: Props) => {
  const { tracks, timeRange } = props;
  const toaster = useRef<Toaster>();

  const handleCreatePlaylist = async () => {
    const range = Constants.TIME_RANGES[timeRange].toLowerCase();
    const date = dayjs().format("MMM YYYY");
    const name = `Top artists of ${range} (${date})`;

    const resultAction = await props.createTopTracksPlaylist({
      name,
      tracks,
    });

    if (createTopTracksPlaylist.fulfilled.match(resultAction)) {
      toaster.current?.show({
        icon: "tick",
        message: "Playlist Created",
        intent: Intent.SUCCESS,
      });

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
    <div className="TopArtists">
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
      <div className="TopArtists__head">
        <h3 className={Classes.HEADING}>Popular tracks by your top artists</h3>
        <Button small={true} onClick={handleCreatePlaylist}>
          Create Playlist
        </Button>
        <Tabs
          id="top_artists"
          className="TopArtists__tabs"
          animate={false}
          renderActiveTabPanelOnly={true}
          defaultSelectedTabId={Constants.DEFAULT_TOP_ARTISTS_PARAMS.time_range}
          onChange={props.getTopArtists}
        >
          <Tab
            id="long_term"
            className="TopArtists__tab"
            title={Constants.TIME_RANGES.long_term}
            panel={<div />}
          />
          <Tab
            id="medium_term"
            className="TopArtists__tab"
            title={Constants.TIME_RANGES.medium_term}
            panel={<div />}
          />
          <Tab
            id="short_term"
            className="TopArtists__tab"
            title={Constants.TIME_RANGES.short_term}
            panel={<div />}
          />
        </Tabs>
      </div>
      <ul className={classNames("TopArtists__tracks", Classes.LIST_UNSTYLED)}>
        {tracks.map(renderTrack)}
      </ul>
    </div>
  );
};

export default connector(TopArtists);