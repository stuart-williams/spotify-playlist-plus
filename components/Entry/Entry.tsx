import React from "react";

export default () => {
  return (
    <div>
      <h1>Playlist +</h1>
      <a href={process.env.AUTHORIZE_URL}>Login</a>
    </div>
  );
};
