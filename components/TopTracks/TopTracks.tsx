import React from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { connect, ConnectedProps } from "react-redux";
import spotifyIcon from "simple-icons/icons/spotify";
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
import Icon, { notesIcon } from "../Icon";
import {
  Tabs,
  Tab,
  Button,
  NonIdealState,
  AnchorButton,
  Intent,
  Classes,
} from "@blueprintjs/core";
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
  const isEmpty = !tracks.items.length;
  const toast = useToast();

  const handleCreatePlaylist = async () => {
    const range = Constants.TIME_RANGES[timeRange].toLowerCase();
    const date = dayjs().format("MMM YYYY");
    const name = `Top tracks of ${range} (${date})`;

    toast?.showPending();
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

  const ideal = !isEmpty && (
    <>
      <div className="TopTracks__head">
        <h3 className={Classes.HEADING}>Your top tracks</h3>
        <Button
          small={true}
          intent={Intent.PRIMARY}
          onClick={handleCreatePlaylist}
        >
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
    </>
  );

  const action = (
    <AnchorButton
      icon={<Icon path={spotifyIcon.path} />}
      intent={Intent.SUCCESS}
      href={process.env.OPEN_SPOTIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open Spotify
    </AnchorButton>
  );

  const nonIdeal = isEmpty && (
    <NonIdealState
      icon={<Icon {...notesIcon} width={60} height={60} />}
      title="We couldn't find your top tracks"
      description="You may not have sufficient play history to generate this list. Come back when you've listened to some more music!"
      action={action}
    />
  );

  return (
    <div className="TopTracks">
      {ideal}
      {nonIdeal}
    </div>
  );
};

export default connector(TopTracks);
