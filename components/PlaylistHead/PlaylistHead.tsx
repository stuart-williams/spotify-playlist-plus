import "./PlaylistHead.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import pluralize from "pluralize";
import ms from "pretty-ms";
import { RootState } from "../../redux";
import { getUser } from "../../redux/user";
import CoverArtImage from "../CoverArtImage";
import PlaylistControls from "../PlaylistControls";

const DIVIDER = " • ";

const mapState = (state: RootState) => ({
  user: getUser(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  playlist: SpotifyApi.PlaylistObjectFull;
};

const formatStats = ({
  tracks,
  followers,
}: SpotifyApi.PlaylistObjectFull): string => {
  const duration = ms(
    tracks.items.reduce((d, item) => d + (item.track?.duration_ms || 0), 0),
    {
      unitCount: 2,
      secondsDecimalDigits: 0,
    }
  );

  const stats = [`${tracks.total} Songs`, duration];

  if (followers.total) {
    stats.push(
      `${new Intl.NumberFormat().format(followers.total)} ${pluralize(
        "Followers",
        followers.total
      )}`
    );
  }

  return stats.join(DIVIDER);
};

const PlaylistHead = (props: Props) => {
  const { user, playlist } = props;
  const { name, images, owner, external_urls } = playlist;
  const isOwner = user.id === playlist.owner.id;
  const isEmpty = !playlist.tracks.items.length;

  const stats = !isEmpty && (
    <div className="bp3-text-muted bp3-text-small">{formatStats(playlist)}</div>
  );

  const controls = isOwner && !isEmpty && (
    <PlaylistControls className="PlaylistHead__controls" playlist={playlist} />
  );

  return (
    <div className="PlaylistHead">
      <CoverArtImage
        className="PlaylistHead__cover-art-image"
        src={images?.[0]?.url}
        alt={name}
      />
      <div>
        <a
          href={external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="bp3-heading">{name}</h3>
        </a>
        <div className="bp3-running-text">
          <div className="bp3-text-muted">By {owner.display_name}</div>
          {stats}
        </div>
        {controls}
      </div>
    </div>
  );
};

export default connector(PlaylistHead);
