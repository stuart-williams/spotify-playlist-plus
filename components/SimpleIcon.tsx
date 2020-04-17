import React from "react";
import { Classes } from "@blueprintjs/core";

interface Props {
  path: string;
}

export default ({ path }: Props) => (
  <span className={Classes.ICON}>
    <svg height="16" width="16" viewBox="0 0 24 24">
      <path d={path} fill="currentColor" />
    </svg>
  </span>
);
