import React from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { useToast } from "../../common/toast";
import {
  getTopTracks,
  selectTopTracks,
  selectTopTracksTimeRange,
} from "../../redux/top";
import { createPlaylist } from "../../redux/playlists";
import { trackCreatedTopTracksPlaylist } from "../../common/analytics";
import * as topApi from "../../api/top";
import Track from "../Track";
import { Tabs, Tab, Button, Classes } from "@blueprintjs/core";
import Router from "next/router";
import Constants from "../../common/constants";

const mapState = (state: RootState) => ({
  tracks: selectTopTracks(state),
  timeRange: selectTopTracksTimeRange(state),
});

const mapDispatch = {
  getTopTracks,
  createPlaylist,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  tracks: SpotifyApi.UsersTopTracksResponse;
  timeRange: topApi.TimeRange;
};

const TopTracks = (props: Props) => {
  const { tracks, timeRange } = props;
  const toast = useToast();

  const handleCreatePlaylist = async () => {
    const range = Constants.TIME_RANGES[timeRange].toLowerCase();
    const date = dayjs().format("MMM YYYY");
    const name = `Top tracks of ${range} (${date})`;

    const resultAction = await props.createPlaylist({
      name,
      tracks: tracks.items,
    });

    if (createPlaylist.fulfilled.match(resultAction)) {
      trackCreatedTopTracksPlaylist(range);
      Router.push("/playlist/[id]", `/playlist/${resultAction.payload.id}`);
    } else {
      toast?.showError({ message: resultAction?.payload?.message });
    }
  };

  const renderTrack = (track: SpotifyApi.TrackObjectFull, i: number) => (
    <Track key={i} track={track} />
  );

  return (
    <div className="TopTracks">
      <div className="TopTracks__head">
        <h3 className={Classes.HEADING}>Your top tracks</h3>
        <Button small={true} onClick={handleCreatePlaylist}>
          Create Playlist
        </Button>
        <Tabs
          id="top_tracks"
          className="TopTracks__tabs"
          animate={false}
          renderActiveTabPanelOnly={true}
          defaultSelectedTabId={Constants.DEFAULT_TOP_TRACKS_PARAMS.time_range}
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
