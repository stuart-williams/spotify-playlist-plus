import "./Navigation.scss";

import React from "react";
import PlaylistsMenu from "../PlaylistsMenu";

const Navigation = () => (
  <nav className="Navigation" role="navigation" aria-label="Main">
    <PlaylistsMenu />
  </nav>
);

export default Navigation;
