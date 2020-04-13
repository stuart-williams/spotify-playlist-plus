import React from "react";
import classNames from "classnames";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getTopTracks, selectTopTracks } from "../../redux/top";
import * as tracksApi from "../../api/tracks";
import Track from "../Track";
import { Tabs, Tab, Classes } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  tracks: selectTopTracks(state),
});

const mapDispatch = {
  getTopTracks,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  tracks: SpotifyApi.UsersTopTracksResponse;
};

const TopTracks = (props: Props) => {
  const { tracks } = props;

  const renderTrack = (track: SpotifyApi.TrackObjectFull, i: number) => (
    <Track key={i} track={track} />
  );

  const handleTabChange = (timeRange: tracksApi.TimeRange) => {
    props.getTopTracks(timeRange);
  };

  return (
    <div className="TopTracks">
      <div className="TopTracks__head">
        <h3 className={Classes.HEADING}>Top Tracks</h3>
        <Tabs
          id="top_tracks"
          renderActiveTabPanelOnly={true}
          onChange={handleTabChange}
        >
          <Tab
            id="long_term"
            className="TopTracks__tab"
            title="All time"
            panel={<div />}
          />
          <Tab
            id="medium_term"
            className="TopTracks__tab"
            title="Last 6 months"
            panel={<div />}
          />
          <Tab
            id="short_term"
            className="TopTracks__tab"
            title="Last month"
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
