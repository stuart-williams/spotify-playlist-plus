import "../../styles/main.scss";
import "./Layout.scss";

import React, { ReactNode } from "react";
import Navigation from "../Navigation";

interface Props {
  children: ReactNode;
}

export default ({ children }: Props) => (
  <div className="Layout">
    <Navigation />
    {children}
  </div>
);
