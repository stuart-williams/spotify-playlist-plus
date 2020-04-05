import "../../styles/main.scss";
import "./Layout.scss";

import React, { ReactNode } from "react";
import Navigation from "../Navigation";

interface Props {
  primaryPanel: ReactNode;
}

export default ({ primaryPanel }: Props) => (
  <div className="Layout">
    <Navigation />
    <div className="Layout__primary-panel">{primaryPanel}</div>
  </div>
);
