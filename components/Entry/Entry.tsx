import React from "react";
import { NonIdealState, AnchorButton } from "@blueprintjs/core";

export default () => {
  const action = (
    <AnchorButton href={process.env.AUTHORIZE_URL}>
      Connect with Spotify
    </AnchorButton>
  );

  return (
    <div className="Entry">
      <NonIdealState
        icon="user"
        title="Let's get started!"
        description="Connect with Spotify to see your playlists."
        action={action}
      />
    </div>
  );
};
