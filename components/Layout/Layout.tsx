import "../../styles/main.scss";
import "./Layout.scss";

import React, { ReactNode } from "react";
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import Navigation from "../Navigation";

interface Props {
  primaryPanel: ReactNode;
}

export default ({ primaryPanel }: Props) => (
  <div className="Layout">
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Playlist +</NavbarHeading>
      </NavbarGroup>
    </Navbar>
    <div className="Layout__body">
      <Navigation />
      <div className="Layout__primary-panel">{primaryPanel}</div>
    </div>
  </div>
);
