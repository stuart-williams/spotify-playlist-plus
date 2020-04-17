import React, { useRef } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { selectUser } from "../../redux/user";
import redirect from "../../common/redirect";
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

const timeRangeMap = {
  long_term: "All time",
  medium_term: "The last 6 months",
  short_term: "The last month",
};

const TopTracks = (props: Props) => {
  const { user, tracks } = props;
  const toaster = useRef<Toaster>();
  const currTimeRange = (tracks.href.match(
    /time_range=(long_term|short_term)/
  )?.[1] || "medium_term") as topApi.TimeRange;

  const renderTrack = (track: SpotifyApi.TrackObjectFull, i: number) => (
    <Track key={i} track={track} />
  );

  const handleCreatePlaylist = async () => {
    const range = timeRangeMap[currTimeRange].toLowerCase();
    const date = dayjs().format("MMM YYYY");
    const name = `Top ${tracks.total} tracks of ${range} (${date})`;

    const resultAction = await props.createTopTracksPlaylist({
      userId: user.id,
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
      redirect(`/playlist/${resultAction.payload.id}`);
    } else {
      toaster.current?.show({
        icon: "warning-sign",
        message: resultAction?.payload?.message || "Unknown Error",
        intent: Intent.DANGER,
      });
    }
  };

  const handleTabChange = (timeRange: topApi.TimeRange) => {
    props.getTopTracks(timeRange);
  };

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
          onChange={handleTabChange}
        >
          <Tab
            id="long_term"
            className="TopTracks__tab"
            title={timeRangeMap.long_term}
            panel={<div />}
          />
          <Tab
            id="medium_term"
            className="TopTracks__tab"
            title={timeRangeMap.medium_term}
            panel={<div />}
          />
          <Tab
            id="short_term"
            className="TopTracks__tab"
            title={timeRangeMap.short_term}
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
