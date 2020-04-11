import "./PlaylistHead.scss";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import pluralize from "pluralize";
import ms from "pretty-ms";
import { RootState } from "../../redux";
import { getUser } from "../../redux/user";
import { Tag } from "@blueprintjs/core";
import Img from "react-image";
import PlaylistControls from "../PlaylistControls";

const mapState = (state: RootState) => ({
  user: getUser(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistHead = (props: Props) => {
  const { user, playlist } = props;
  const { name, images, owner, followers, tracks } = playlist;
  const isOwner = user.id === playlist.owner.id;
  const duration = ms(
    tracks.items.reduce((d, item) => d + (item.track?.duration_ms || 0), 0),
    {
      unitCount: 2,
      secondsDecimalDigits: 0,
    }
  );

  const tag = !!followers.total && (
    <Tag>
      {new Intl.NumberFormat().format(followers.total)}{" "}
      {pluralize("Followers", followers.total)}
    </Tag>
  );

  return (
    <div className="PlaylistHead">
      <div className="PlaylistHead__image">
        <Img src={images?.[0]?.url} alt={name} />
      </div>
      <div className="PlaylistHead__meta">
        <div className="PlaylistHead__title">
          <h3 className="bp3-heading">{name}</h3>
          <div className="PlaylistHead__tag">{tag}</div>
        </div>
        <div className="bp3-running-text">
          <div className="bp3-text-muted">By {owner.display_name}</div>
          <div className="bp3-text-muted bp3-text-small">
            {tracks.total}
            {" Songs • "}
            {duration}
          </div>
        </div>
        {isOwner && <PlaylistControls playlist={playlist} />}
      </div>
    </div>
  );
};

export default connector(PlaylistHead);
