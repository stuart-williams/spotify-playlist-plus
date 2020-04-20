import React from "react";
import classNames from "classnames";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { selectTopArtistsTracks } from "../../redux/top";
import Track from "../Track";
import { Tabs, Tab, Button, Classes } from "@blueprintjs/core";
import Constants from "../../common/constants";

const mapState = (state: RootState) => ({
  tracks: selectTopArtistsTracks(state),
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  tracks: SpotifyApi.TrackObjectFull[];
};

const TopArtists = ({ tracks }: Props) => {
  const renderTrack = (track: SpotifyApi.TrackObjectFull, i: number) => (
    <Track key={i} track={track} />
  );

  return (
    <div className="TopArtists">
      <div className="TopArtists__head">
        <h3 className={Classes.HEADING}>Popular tracks by your top artists</h3>
        <Button small={true}>Create Playlist</Button>
        <Tabs
          id="top_artists"
          className="TopArtists__tabs"
          animate={false}
          renderActiveTabPanelOnly={true}
          defaultSelectedTabId={Constants.DEFAULT_TOP_ARTISTS_PARAMS.time_range}
          // onChange={props.getTopArtists}
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
